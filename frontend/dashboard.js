/**
 * dashboard.js — LÓGICA DO PAINEL DE CONTROLE
 * =============================================
 * Depende de: api-mock.js (deve ser carregado antes deste script)
 *
 * Padrão de carregamento:
 *  1. Mostra skeleton loaders imediatamente
 *  2. Busca dados da API (mock ou real)
 *  3. Renderiza os componentes
 *  4. Trata erros com mensagens visíveis ao usuário
 */

document.addEventListener("DOMContentLoaded", async () => {

    // ─── UTILIDADES ───────────────────────────────────────────────────────────

    /** Formata posição de chegada com sufixo e classe de cor */
    function formatPosition(pos) {
        if (pos === null) return `<span class="pos-dnf">DNF</span>`;
        const cls = pos === 1 ? "pos-win" : pos <= 3 ? "pos-pod" : "pos-norm";
        return `<span class="${cls}">P${pos}</span>`;
    }

    /** Exibe estado de erro numa seção */
    function showError(containerId, message) {
        const el = document.getElementById(containerId);
        if (el) el.innerHTML = `<p class="dash-error">⚠️ ${message}</p>`;
    }

    // ─── BLOCO: MÉTRICAS RÁPIDAS (KPI CARDS) ─────────────────────────────────
    async function renderKPIs() {
        try {
            const stats = await API.getTeamStats();

            document.getElementById("kpi-position").textContent = `P${stats.constructorsPosition}`;
            document.getElementById("kpi-points").textContent   = stats.constructorsPoints;
            document.getElementById("kpi-wins").textContent     = stats.wins;
            document.getElementById("kpi-podiums").textContent  = stats.podiums;
            document.getElementById("kpi-laps").textContent     = stats.totalLaps.toLocaleString("pt-BR");
            document.getElementById("kpi-dnfs").textContent     = stats.dnfs;

            // Remove skeleton
            document.querySelectorAll(".kpi-card").forEach(c => c.classList.remove("loading"));

        } catch (err) {
            console.error("[Dashboard] Erro KPIs:", err);
            showError("kpi-section", "Não foi possível carregar os KPIs.");
        }
    }

    // ─── BLOCO: TABELA DE RESULTADOS ─────────────────────────────────────────
    async function renderRaceResults() {
        try {
            const results = await API.getRaceResults();
            const tbody = document.getElementById("results-tbody");
            if (!tbody) return;

            tbody.innerHTML = results.map(r => `
                <tr>
                    <td class="td-round">${r.round}</td>
                    <td class="td-gp">
                        <span class="gp-name-cell">${r.gp}</span>
                        <span class="gp-circuit">${r.circuit}</span>
                    </td>
                    <td>${formatPosition(r.hugoPos)}${r.hugoFastest ? ' <span class="fastest-dot" title="Fastest Lap">⬟</span>' : ''}</td>
                    <td>${formatPosition(r.erickPos)}${r.erickFastest ? ' <span class="fastest-dot" title="Fastest Lap">⬟</span>' : ''}</td>
                    <td class="td-points">${r.points} pts</td>
                </tr>
            `).join("");

        } catch (err) {
            console.error("[Dashboard] Erro resultados:", err);
            showError("results-section", "Não foi possível carregar os resultados.");
        }
    }

    // ─── BLOCO: CLASSIFICAÇÃO DE CONSTRUTORES ─────────────────────────────────
    async function renderStandings() {
        try {
            const standings = await API.getConstructorsStandings();
            const leader    = standings[0].points;
            const container = document.getElementById("standings-list");
            if (!container) return;

            container.innerHTML = standings.map(s => {
                const pct = ((s.points / leader) * 100).toFixed(1);
                return `
                    <div class="standing-row ${s.isWindspeed ? "is-windspeed" : ""}">
                        <span class="s-pos">P${s.position}</span>
                        <span class="s-team">${s.team}${s.isWindspeed ? ' <span class="ws-tag">NÓS</span>' : ''}</span>
                        <div class="s-bar-wrap">
                            <div class="s-bar" style="width: ${pct}%"></div>
                        </div>
                        <span class="s-pts">${s.points}</span>
                    </div>
                `;
            }).join("");

        } catch (err) {
            console.error("[Dashboard] Erro standings:", err);
            showError("standings-section", "Não foi possível carregar a classificação.");
        }
    }

    // ─── BLOCO: COMPARATIVO DE PILOTOS ────────────────────────────────────────
    async function renderDriverComparison() {
        try {
            const drivers = await API.getDriverStats();
            const [hugo, erick] = drivers;
            if (!hugo || !erick) return;

            const metrics = [
                { label: "Pontos",          hugoVal: hugo.points,               erickVal: erick.points,               unit: "pts" },
                { label: "Posição no Camp.", hugoVal: hugo.championshipPosition, erickVal: erick.championshipPosition, unit: "°",  lowerIsBetter: true },
                { label: "Vitórias",         hugoVal: hugo.wins,                 erickVal: erick.wins,                 unit: "" },
                { label: "Pódios",           hugoVal: hugo.podiums,              erickVal: erick.podiums,              unit: "" },
                { label: "Voltas Mais Rápidas", hugoVal: hugo.fastestLaps,       erickVal: erick.fastestLaps,          unit: "" },
                { label: "Voltas Completadas",  hugoVal: hugo.lapsCompleted,     erickVal: erick.lapsCompleted,        unit: "" }
            ];

            const container = document.getElementById("driver-comparison");
            if (!container) return;

            container.innerHTML = `
                <div class="comp-header">
                    <span class="comp-driver-name">#${hugo.number} ${hugo.name}</span>
                    <span class="comp-vs">VS</span>
                    <span class="comp-driver-name">#${erick.number} ${erick.name}</span>
                </div>
                ${metrics.map(m => {
                    const total = m.hugoVal + m.erickVal || 1;
                    const hugoPct  = ((m.hugoVal / total) * 100).toFixed(1);
                    const erickPct = (100 - parseFloat(hugoPct)).toFixed(1);
                    const hugoWins = m.lowerIsBetter
                        ? m.hugoVal < m.erickVal
                        : m.hugoVal > m.erickVal;

                    return `
                        <div class="comp-row">
                            <span class="comp-val ${hugoWins ? "comp-winner" : ""}">${m.hugoVal}${m.unit}</span>
                            <div class="comp-bar-wrap">
                                <div class="comp-bar-hugo"  style="width: ${hugoPct}%"></div>
                                <div class="comp-bar-erick" style="width: ${erickPct}%"></div>
                            </div>
                            <span class="comp-val ${!hugoWins ? "comp-winner" : ""}">${m.erickVal}${m.unit}</span>
                            <span class="comp-label">${m.label}</span>
                        </div>
                    `;
                }).join("")}
            `;

        } catch (err) {
            console.error("[Dashboard] Erro comparativo:", err);
            showError("comparison-section", "Não foi possível carregar o comparativo.");
        }
    }

    // ─── INICIALIZAÇÃO PARALELA ───────────────────────────────────────────────
    // Promise.allSettled garante que um erro num bloco não derruba os outros.
    await Promise.allSettled([
        renderKPIs(),
        renderRaceResults(),
        renderStandings(),
        renderDriverComparison()
    ]);

    // Timestamp de última atualização
    const tsEl = document.getElementById("last-updated");
    if (tsEl) tsEl.textContent = new Date().toLocaleString("pt-BR");
});
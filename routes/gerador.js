const express = require('express');
const routes = express.Router();
const db = require('../db');

routes.post('/gerarvoltas', (req, res) => {
    const numeroDeVoltas = 2;
    let totalInseridos = 0;

    db.query('SELECT * FROM corredores', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar corredores' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Nenhum corredor encontrado' });
        }

        results.forEach(corredor => {
            for (let i = 1; i <= numeroDeVoltas; i++) {
                const tempoAleatorio = (Math.random() * (120 - 60) + 60).toFixed(2);

                db.query(
                    'INSERT INTO voltas (tempo, data, corredores_id) VALUES (?, NOW(), ?)',
                    [tempoAleatorio, corredor.id],
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            totalInseridos++;
                        }
                    }
                );
            }
        });

        res.status(201).json({
            message: 'Voltas aleatórias criadas com sucesso',
            corredores: results.length,
            voltas_por_corredor: numeroDeVoltas,
            total_estimado: results.length * numeroDeVoltas
        });
    });
});

module.exports = routes;
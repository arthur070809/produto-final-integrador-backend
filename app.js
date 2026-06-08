const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // HTTP server que o WS vai usar

// ─── WebSocket Server ─────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ server });

// Estado global da corrida
const estadoCorrida = {
  ativa: false,
  inicioTimestamp: null,
  corredores: {} // { [corredorId]: { nome, finalizado, tempoFinal, turma } }
};

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  // Ao conectar, envia o estado atual da corrida
  ws.send(JSON.stringify({ tipo: 'estado', ...estadoCorrida }));
});

// Expõe funções de controle para as rotas
app.locals.corrida = {
  getEstado: () => estadoCorrida,

  iniciar: (corredores) => {
    estadoCorrida.ativa = true;
    estadoCorrida.inicioTimestamp = Date.now();
    estadoCorrida.corredores = {};
    corredores.forEach(c => {
      estadoCorrida.corredores[c.id] = {
        nome: c.nome,
        turma: c.turma || '—',
        finalizado: false,
        tempoFinal: null
      };
    });
    broadcast({ tipo: 'corrida_iniciada', ...estadoCorrida });
  },

  registrarChegada: (corredorId) => {
    const corredor = estadoCorrida.corredores[corredorId];
    if (!corredor || corredor.finalizado) return null;

    const tempoMs = Date.now() - estadoCorrida.inicioTimestamp;
    const tempoSegundos = (tempoMs / 1000).toFixed(2);
    corredor.finalizado = true;
    corredor.tempoFinal = tempoSegundos;

    broadcast({ tipo: 'corredor_chegou', corredorId, tempoFinal: tempoSegundos, estado: estadoCorrida });
    return tempoSegundos;
  },

  encerrar: () => {
    estadoCorrida.ativa = false;
    broadcast({ tipo: 'corrida_encerrada', estado: estadoCorrida });
  }
};

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
const userRoutes      = require('./routes/users');
const corredoresRoutes = require('./routes/corredores');
const voltasRoutes    = require('./routes/voltas');
const geradorRoutes   = require('./routes/gerador');
const corridaRoutes   = require('./routes/corrida');

app.use('/usuarios', userRoutes);
app.use('/corredores', corredoresRoutes);
app.use('/voltas', voltasRoutes);
app.use('/gerador', geradorRoutes);
app.use('/corrida', corridaRoutes);

module.exports = { app, server };
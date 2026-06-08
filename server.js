const { server } = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`WebSocket ativo em ws://localhost:${port}`);
});
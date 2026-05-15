import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authenticateBackend } from './config/apiClient.js';

// Import handlers
import registerAuthHandlers from './handlers/auth.js';
import registerPartidaHandlers from './handlers/partidas.js';
import registerBanderaHandlers from './handlers/bandera.js';
import registerGeneralHandlers from './handlers/general.js';
import registerRankingHandlers from './handlers/ranking.js';
import registerExampleHandlers from './handlers/example.js';


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL;

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  console.log('Total clientes:', io.engine.clientsCount);

  // Register all handlers
  registerAuthHandlers(io, socket);
  registerPartidaHandlers(io, socket);
  registerBanderaHandlers(io, socket);
  registerGeneralHandlers(io, socket);
  registerRankingHandlers(io, socket);
  registerExampleHandlers(io, socket);


  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Startup
authenticateBackend()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.warn('⚠️ Warning: API REST authentication failed. Backend will run but some features may be disabled.');
    startServer();
  });

function startServer() {
  httpServer.listen(PORT, () => {
    console.log(`Middleware Service running on port ${PORT}`);
    console.log(`Forwarding requests to API at ${API_BASE_URL}`);
  });
}


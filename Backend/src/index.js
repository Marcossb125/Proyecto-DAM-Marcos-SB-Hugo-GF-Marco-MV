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

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Startup
authenticateBackend()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Middleware Service running on port ${PORT}`);
      console.log(`Forwarding requests to API at ${API_BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error('Critical error during startup:', err);
    process.exit(1);
  });

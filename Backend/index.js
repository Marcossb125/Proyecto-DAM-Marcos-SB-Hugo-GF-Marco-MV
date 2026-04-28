import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import z from 'zod';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

const loginPayload = z.object({
  nickname: z.string().min(3).max(20).trim(),
  password: z.string().min(6).max(100).trim(),
});

const registerPayload = z.object({
  nickname: z.string().min(0).max(20).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).max(100).trim(),
});

const API_BASE_URL = process.env.API_BASE_URL;
const JWT = process.env.JWT;

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  console.log('Origen:', socket.handshake.headers.origin);
  console.log('IP:', socket.handshake.address);
  console.log('Total clientes:', io.engine.clientsCount);

  // Handle registration
  socket.on('register', async (userData, callback) => { // ← recibir callback como parámetro
    console.log(`Received register request for: ${userData.nickname}`);

    const sanitize = registerPayload.safeParse(userData);
    if (!sanitize.success) {
      callback({ success: false, error: "Datos no validos" });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, sanitize.data);
      callback({ success: true, data: response.data }); // ← llamar callback
    } catch (error) {
      callback({ success: false, error: error.response?.data || 'Registration failed' });
    }
  });

  // Handle login
  socket.on('login', async (data, callback) => {

    const sanitize = loginPayload.safeParse(data);
    if (!sanitize.success) {
      callback({ success: false, error: "Datos no validos" });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);

      // Successful login at Spring Boot API -> Generate token for frontend access to middleware
      const token = jwt.sign(
        { nickname: data.nickname },
        JWT,
      );

      console.log('Login successful for:', data.nickname);
      console.log('Generated token:', token);

      callback({
        success: true,
        data: token,
      });
    } catch (error) {
      console.log(error);
      callback({ success: false, error: error.response?.data || 'Login failed' });
    }
  });

  // Handle handshake
  socket.on('handshake', (handshakeData, callback) => {
    try {
      console.log('Handshake data:', handshakeData);
      const userToken = jwt.sign(
        { nickname: handshakeData.nickname },
        JWT)



      const decoded = jwt.verify(handshakeData.token, JWT);
      console.log('Handshake successful for:', decoded.nickname);
      socket.user = decoded;
      callback({ success: true });
    } catch (error) {
      console.log('Handshake failed:', error.message);
      callback({ success: false, error: 'Invalid token' });
    }
  });

  /* socket.on('createRoom', async (data) => {
    try {
      // 1. Crear partida en la API
      const partidaResponse = await axios.post(
        "http://localhost:8080/partida", // Tu API Rest
        {
          nombre: data.nombre,
          jugadores_limite: data.jugadores_limite,
          host_id: data.host_id
        },
        {
          headers: {
            "Authorization": "Bearer " + data.token // IMPORTANTE: Token de autenticación
          }
        }
      );

      // 2. Obtener el ID de la partida creada
      const partidaId = partidaResponse.data.id;

      // 3. Unir el socket a un "room" de Socket.IO
      socket.join(partidaId.toString());

      // 4. Notificar al cliente que se unió a la sala
      socket.emit("roomJoined", {
        success: true,
        partida: partidaResponse.data,
        roomId: partidaId
      });

    } catch (error) {
      socket.emit("roomJoined", {
        success: false,
        error: error.response?.data || "Error al crear la sala"
      });
    }
  });

  */

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});



const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Middleware Service running on port ${PORT}`);
  console.log(`Forwarding requests to API at ${API_BASE_URL}`);
});

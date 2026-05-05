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
  nickname: z.string().min(3).max(20).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).max(100).trim(),
});

const createRoomPayload = z.object({
  nombre: z.string().min(1).max(100).trim(),
  jugadores_limite: z.number().min(2).max(4),
  hostNombre: z.string().min(3).max(20).trim(),
});

const deleteRoomPayload = z.object({
  nombre: z.string().min(1).max(100).trim(),
  hostNombre: z.string().min(3).max(20).trim(),
});

const banderaPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
  nombre: z.string(),
  bandera: z.object({
    layout: z.string().min(1),
    colors: z.array(z.string())
  })
});

const obtenerBanderaPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
});

const generalPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
  generalId: z.number()
});

const obtenerGeneralPayload = z.object({
  nickname: z.string().min(3).max(100).trim(),
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

  socket.on('createRoom', async (data, callback) => {
    try {
      const sanitize = createRoomPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos no validos" });
        return;
      }
      const partidaResponse = await axios.post(
        `${API_BASE_URL}/partidas/crear`,
        {
          nombre: sanitize.data.nombre,
          jugadores_limite: sanitize.data.jugadores_limite,
          hostNombre: sanitize.data.hostNombre
        },
      );

      callback({ success: true, data: partidaResponse.data });

    } catch (error) {
      console.log("adios" + error)
      callback({
        success: false,
        error: error.response?.data || "Error al crear la sala"
      });
    }
  });

  socket.on('buscarPartidas', async (callback) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/partidas/buscar/activas`);
      callback({ success: true, data: response.data });
    } catch (error) {
      callback({ success: false, error: 'Error al buscar partidas' });
    }
  });

  socket.on('deleteRoom', async (nombre, callback) => {
    try {
      const sanitize = deleteRoomPayload.safeParse(nombre);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos no validos" });
        return;
      }
      // 1. Buscar la partida por nombre para obtener su ID
      const findResponse = await axios.get(`${API_BASE_URL}/partidas/nombre/${nombre}`);
      const partida = findResponse.data;

      if (!partida || !partida.id) {
        callback({ success: false, error: 'No se encontró la partida' });
        return;
      }

      // 2. Borrar la partida por ID
      await axios.delete(`${API_BASE_URL}/partidas/${partida.id}`);

      callback({ success: true });
    } catch (error) {
      console.log('Error al borrar la partida:', error.message);
      callback({
        success: false,
        error: error.response?.status === 404 ? 'Partida no encontrada' : 'Error al borrar la partida'
      });
    }
  });

  // ── Bandera ──────────────────────────────────────────────────────────────

  socket.on('guardarBandera', async (data, callback) => {
    try {
      const sanitize = banderaPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos de bandera no válidos" });
        return;
      }
      const response = await axios.put(
        `${API_BASE_URL}/bandera/guardar`,
        {
          nickname: sanitize.data.nickname,
          nombre: sanitize.data.nombre,
          bandera: sanitize.data.bandera
        }
      );
      callback({ success: true, data: response.data });
    } catch (error) {
      console.log('Error al guardar bandera:', error.message);
      callback({
        success: false,
        error: error.response?.data || 'Error al guardar la bandera'
      });
    }
  });

  socket.on('obtenerBandera', async (data, callback) => {
    try {
      const sanitize = obtenerBanderaPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Nickname no válido" });
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/bandera/${sanitize.data.nickname}`
      );
      callback({ success: true, data: response.data });
    } catch (error) {
      console.log('Error al obtener bandera:', error.message);
      callback({
        success: false,
        error: error.response?.data || 'Error al obtener la bandera'
      });
    }
  });

  // ── General ──────────────────────────────────────────────────────────────

  socket.on('guardarGeneral', async (data, callback) => {
    try {
      const sanitize = generalPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos de general no válidos" });
        return;
      }
      const response = await axios.put(
        `${API_BASE_URL}/general/guardar`,
        {
          nickname: sanitize.data.nickname,
          generalId: sanitize.data.generalId
        }
      );
      callback({ success: true, data: response.data });
    } catch (error) {
      console.log('Error al guardar general:', error.message);
      callback({
        success: false,
        error: error.response?.data || 'Error al guardar el general'
      });
    }
  });

  socket.on('obtenerGeneral', async (data, callback) => {
    try {
      const sanitize = obtenerGeneralPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Nickname no válido" });
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/general/${sanitize.data.nickname}`
      );
      callback({ success: true, data: response.data });
    } catch (error) {
      console.log('Error al obtener general:', error.message);
      callback({
        success: false,
        error: error.response?.data || 'Error al obtener el general'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});



const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Middleware Service running on port ${PORT}`);
  console.log(`Forwarding requests to API at ${API_BASE_URL}`);
});

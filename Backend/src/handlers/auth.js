import jwt from 'jsonwebtoken';
import apiClient from '../config/apiClient.js';
import { loginPayload, registerPayload } from '../schemas/index.js';

const JWT_SECRET = process.env.JWT_SECRET_NODE;

export default (io, socket) => {
  socket.on('register', async (userData, callback) => {
    console.log(`Received register request for: ${userData.nickname}`);

    const sanitize = registerPayload.safeParse(userData);
    if (!sanitize.success) {
      callback({ success: false, error: "Datos no validos" });
      return;
    }
    try {
      const response = await apiClient.post(`/auth/register`, sanitize.data);
      callback({ success: true, data: response.data });
    } catch (error) {
      callback({ success: false, error: error.response?.data || 'Registration failed' });
    }
  });

  socket.on('login', async (data, callback) => {
    const sanitize = loginPayload.safeParse(data);
    if (!sanitize.success) {
      callback({ success: false, error: "Datos no validos" });
      return;
    }
    try {
      const response = await apiClient.post(`/auth/login`, data);

      const token = jwt.sign(
        { nickname: data.nickname },
        JWT_SECRET,
      );

      callback({
        success: true,
        data: token,
      });
    } catch (error) {
      callback({ success: false, error: error.response?.data || 'Login failed' });
    }
  });

  socket.on('handshake', (handshakeData, callback) => {
    try {
      const decoded = jwt.verify(handshakeData.token, JWT_SECRET);
      socket.user = decoded;
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: 'Invalid token' });
    }
  });
};

import jwt from 'jsonwebtoken';
import apiClient from '../config/apiClient.js';
import { loginPayload, registerPayload } from '../schemas/index.js';

const JWT_SECRET = process.env.JWT;

export default (io, socket) => {
  // Handle registration
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

  // Handle login
  socket.on('login', async (data, callback) => {
    const sanitize = loginPayload.safeParse(data);
    if (!sanitize.success) {
      callback({ success: false, error: "Datos no validos" });
      return;
    }
    try {
      const response = await apiClient.post(`/auth/login`, data);

      // Successful login at Spring Boot API -> Generate token for frontend access to middleware
      const token = jwt.sign(
        { nickname: data.nickname },
        JWT_SECRET,
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
      const decoded = jwt.verify(handshakeData.token, JWT_SECRET);
      console.log('Handshake successful for:', decoded.nickname);
      socket.user = decoded;
      callback({ success: true });
    } catch (error) {
      console.log('Handshake failed:', error.message);
      callback({ success: false, error: 'Invalid token' });
    }
  });
};

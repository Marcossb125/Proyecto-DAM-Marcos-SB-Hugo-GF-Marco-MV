import apiClient from '../config/apiClient.js';
import { banderaPayload, obtenerBanderaPayload } from '../schemas/index.js';

export default (io, socket) => {
  socket.on('guardarBandera', async (data, callback) => {
    try {
      const sanitize = banderaPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos de bandera no válidos" });
        return;
      }
      const response = await apiClient.put(
        `/bandera/guardar`,
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
      const response = await apiClient.get(
        `/bandera/${sanitize.data.nickname}`
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
};

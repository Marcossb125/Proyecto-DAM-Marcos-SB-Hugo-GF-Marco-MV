import apiClient from '../config/apiClient.js';
import { generalPayload, obtenerGeneralPayload } from '../schemas/index.js';

export default (io, socket) => {
  socket.on('guardarGeneral', async (data, callback) => {
    try {
      const sanitize = generalPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos de general no válidos" });
        return;
      }
      const response = await apiClient.put(
        `/general/guardar`,
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
      const response = await apiClient.get(
        `/general/${sanitize.data.nickname}`
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
};

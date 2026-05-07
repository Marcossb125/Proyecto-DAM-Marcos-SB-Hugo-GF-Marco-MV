import apiClient from '../config/apiClient.js';
import { createRoomPayload, deleteRoomPayload } from '../schemas/index.js';

export default (io, socket) => {
  socket.on('createRoom', async (data, callback) => {
    try {
      const sanitize = createRoomPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos no validos" });
        return;
      }
      const partidaResponse = await apiClient.post(
        `/partidas/crear`,
        {
          nombre: sanitize.data.nombre,
          jugadores_limite: sanitize.data.jugadores_limite,
          hostNombre: sanitize.data.hostNombre
        },
      );

      callback({ success: true, data: partidaResponse.data });

    } catch (error) {
      console.log("Error al crear sala: " + error)
      callback({
        success: false,
        error: error.response?.data || "Error al crear la sala"
      });
    }
  });

  socket.on('buscarPartidas', async (callback) => {
    try {
      const response = await apiClient.get(`/partidas/buscar/activas`);
      callback({ success: true, data: response.data });
    } catch (error) {
      callback({ success: false, error: 'Error al buscar partidas' });
    }
  });

  socket.on('deleteRoom', async (data, callback) => {
    try {
      const sanitize = deleteRoomPayload.safeParse(data);
      if (!sanitize.success) {
        callback({ success: false, error: "Datos no validos" });
        return;
      }
      // 1. Buscar la partida por nombre para obtener su ID
      const findResponse = await apiClient.get(`/partidas/nombre/${sanitize.data.nombre}`);
      const partida = findResponse.data;

      if (!partida || !partida.id) {
        callback({ success: false, error: 'No se encontró la partida' });
        return;
      }

      // 2. Borrar la partida por ID enviando el requester obligatorio
      await apiClient.delete(`/partidas/${partida.id}`, {
        params: { requester: sanitize.data.hostNombre }
      });

      callback({ success: true });
    } catch (error) {
      console.log('Error al borrar la partida:', error.message);
      callback({
        success: false,
        error: error.response?.status === 404 ? 'Partida no encontrada' : 'Error al borrar la partida'
      });
    }
  });
};

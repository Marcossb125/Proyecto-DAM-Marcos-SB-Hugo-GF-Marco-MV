import apiClient from '../config/apiClient.js';

export default (io, socket) => {
  socket.on('getRanking', async (callback) => {
    try {
      const response = await apiClient.get('/ranking');
      callback({ success: true, data: response.data });
    } catch (error) {
      console.error('Error fetching ranking:', error.message);
      callback({ success: false, error: 'Error al obtener el ranking' });
    }
  });

  socket.on('getGeneralStats', async (generalId, callback) => {
    try {
      const response = await apiClient.get(`/ranking/general/${generalId}`);
      callback({ 
        success: true, 
        data: response.data 
      });
    } catch (error) {
      console.error('Error fetching general stats:', error.message);
      callback({ success: false, error: 'Error al obtener estadísticas del general' });
    }
  });
};

import apiClient from '../config/apiClient.js';

export default (io, socket) => {
  socket.on('TEST_EVENT', async (data) => {
    console.log(`[ExampleHandler] Evento recibido. Solicitando datos a API REST (Java)...`);

    try {
      // LLAMADA AL VERDADERO BACKEND (API REST JAVA)
      // Usamos el endpoint /ranking como ejemplo real
      const response = await apiClient.get('/ranking');
      const rankingData = response.data;

      const result = {
        message: 'Datos recuperados del Backend Java con éxito',
        originalRequest: data.message,
        serverTime: new Date().toLocaleTimeString(),
        // Enviamos una versión resumida o el primer elemento para el ejemplo
        dataCount: rankingData.length,
        topPlayer: rankingData.length > 0 ? rankingData[0].nickname : 'Nadie aún',
        fullData: rankingData.slice(0, 3) // Solo los 3 primeros para no saturar
      };

      console.log(`[ExampleHandler] Respuesta de Java recibida. Enviando a Frontend via Socket.`);
      socket.emit('TEST_RESPONSE', result);

    } catch (error) {
      console.error('[ExampleHandler] Error al contactar con API REST Java:', error.message);
      
      socket.emit('TEST_RESPONSE', {
        message: 'Error: El Middleware no pudo contactar con la API REST (Backend)',
        error: error.message,
        serverTime: new Date().toLocaleTimeString()
      });
    }
  });
};


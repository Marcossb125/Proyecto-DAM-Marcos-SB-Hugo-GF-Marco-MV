import apiClient from '../config/apiClient.js';
import { 
  createRoomPayload, 
  deleteRoomPayload,
  joinMatchPayload,
  playerReadyPayload,
  buildPayload,
  destroyBuildingPayload,
  recruitPayload,
  queueMovePayload,
  cancelMovePayload,
  retreatPayload
} from '../schemas/index.js';

import { initMatch, getMatch, removeMatch, loadLatestSnapshot, saveSnapshot } from '../game/matchStore.js';
import * as gameEngine from '../game/gameEngine.js';
import { runBotsForCurrentPhase } from '../game/botAI.js';

export default (io, socket) => {
  socket.on('createRoom', async (data, callback) => {
    try {
      const sanitize = createRoomPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos no validos" });
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

      // Initialize match in memory
      const matchId = partidaResponse.data.id.toString();
      initMatch(matchId, sanitize.data.jugadores_limite, sanitize.data.hostNombre);
      saveSnapshot(matchId);

      callback && callback({ success: true, data: partidaResponse.data });

    } catch (error) {
      console.log("Error al crear sala: " + error)
      if (callback) {
        callback({
          success: false,
          error: error.response?.data || "Error al crear la sala"
        });
      }
    }
  });

  socket.on('buscarPartidas', async (callback) => {
    try {
      const response = await apiClient.get(`/partidas/buscar/activas`);
      if (callback) callback({ success: true, data: response.data });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error al buscar partidas' });
    }
  });

  socket.on('buscarMisPartidas', async (data, callback) => {
    try {
      const { nickname } = data;
      const response = await apiClient.get(`/partidas/usuario/${nickname}`);
      if (callback) callback({ success: true, data: response.data });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error al buscar mis partidas' });
    }
  });

  socket.on('deleteRoom', async (data, callback) => {
    try {
      const sanitize = deleteRoomPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos no validos" });
        return;
      }
      const findResponse = await apiClient.get(`/partidas/nombre/${sanitize.data.nombre}`);
      const partida = findResponse.data;

      if (!partida || !partida.id) {
        callback({ success: false, error: 'No se encontró la partida' });
        return;
      }

      await apiClient.delete(`/partidas/${partida.id}`, {
        params: { requester: sanitize.data.hostNombre }
      });

      removeMatch(partida.id.toString());
      if (callback) callback({ success: true });
    } catch (error) {
      console.log('Error al borrar la partida:', error.message);
      if (callback) {
        callback({
          success: false,
          error: error.response?.status === 404 ? 'Partida no encontrada' : 'Error al borrar la partida'
        });
      }
    }
  });

  // GAME EVENTS

  const emitGameUpdate = (matchId, state, logEntry) => {
    if (state) io.to(matchId).emit('GAME_STATE_UPDATE', state);
    if (logEntry) io.to(matchId).emit('GAME_LOG_ENTRY', logEntry);
  };

  const checkBotsAndPhase = (matchId) => {
    const emitSummary = (summary) => {
      io.to(matchId).emit('RECAUDACION_SUMMARY', summary);
    };
    runBotsForCurrentPhase(matchId, (state, logEntry) => {
      emitGameUpdate(matchId, state, logEntry);
    }, emitSummary);
  };

  socket.on('joinMatch', async (data, callback) => {
    try {
      const sanitize = joinMatchPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }
      
      const { matchId, playerId } = sanitize.data;
      let state = getMatch(matchId);
      
      if (!state) {
        // Intentar restaurar desde la base de datos
        state = await loadLatestSnapshot(matchId);
        if (!state) {
          if (callback) callback({ success: false, error: "Partida no encontrada en memoria ni en BD" });
          return;
        }
      }

      // Unirse a la sala PRIMERO para garantizar que se reciban los GAME_STATE_UPDATE
      socket.join(matchId);
      console.log(`[joinMatch] Socket ${socket.id} unido a sala ${matchId}`);

      // Persistir participación en la API de Spring Boot (no bloqueante si ya existe)
      try {
        await apiClient.post(`/partidas/${matchId}/unirse?nickname=${playerId}`);
      } catch (error) {
        // Si la API falla (ej. jugador ya registrado), lo registramos pero continuamos
        console.warn(`[joinMatch] API warn para ${playerId}:`, error.response?.data || error.message);
      }

      // Find an available bot slot to replace with human
      let player = state.players.find(p => p.id === playerId);
      if (!player) {
        player = state.players.find(p => p.isBot);
        if (player) {
          const oldId = player.id;
          player.id = playerId; 
          player.name = playerId;
          player.isBot = false;
          player.isConnected = true;
          player.socketId = socket.id;

          // Update ownership of territories and armies
          state.territories.forEach(t => {
            if (t.ownerId === oldId) t.ownerId = playerId;
          });
          state.armies.forEach(a => {
            if (a.ownerId === oldId) a.ownerId = playerId;
          });
          if (state.currentPlayerId === oldId) {
            state.currentPlayerId = playerId;
          }
        } else {
          return callback({ success: false, error: "Sala llena" });
        }
      } else {
        player.isConnected = true;
        player.socketId = socket.id;
      }

      const log = {
        matchId,
        timestamp: new Date().toISOString(),
        type: 'system',
        actorName: 'Sistema',
        message: `${player.name} se unió a la partida`
      };

      // Emitir directamente al socket que acaba de unirse (garantía extra)
      socket.emit('GAME_STATE_UPDATE', state);
      // Y también a toda la sala
      emitGameUpdate(matchId, state, log);
      if (callback) callback({ success: true });

      // Trigger bots in case this is the first player joining
      checkBotsAndPhase(matchId);

    } catch (error) {
      console.log(error);
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('leaveMatch', async (data, callback) => {
    // Simply mark as disconnected or bot
    if (callback) callback({ success: true });
  });

  socket.on('playerReady', async (data, callback) => {
    try {
      const sanitize = playerReadyPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }


      const res = gameEngine.applyPlayerReady(state, playerId);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));

      if (res.phaseAdvanced) {
        // Si hubo recaudación, emitir resumen ANTES del estado actualizado
        if (res.recaudacionSummary) {
          io.to(matchId).emit('RECAUDACION_SUMMARY', res.recaudacionSummary);
        }
        emitGameUpdate(matchId, res.state, null);
        socket.emit('GAME_STATE_UPDATE', res.state); // garantía directa
        saveSnapshot(matchId);
        checkBotsAndPhase(matchId);
      } else {
        emitGameUpdate(matchId, res.state, null);
        socket.emit('GAME_STATE_UPDATE', res.state); // garantía directa
        checkBotsAndPhase(matchId);
      }

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('build', async (data, callback) => {
    try {
      console.log('--- ACTION BUILD ---', data);
      const sanitize = buildPayload.safeParse(data);
      if (!sanitize.success) {
        console.log('Build validation failed:', sanitize.error);
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, territoryId, buildingType } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        console.log('Match not found for build:', matchId);
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyBuild(state, playerId, territoryId, buildingType);
      if (res.error) {
        console.log('Build rejected by engine:', res.error);
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      console.log('Build success, emitting update');
      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);
      // Garantía extra: emitir directamente al socket que realizó la acción
      socket.emit('GAME_STATE_UPDATE', res.state);

      if (callback) callback({ success: true });
    } catch (error) {
      console.log('Error in build:', error);
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('destroyBuilding', async (data, callback) => {
    try {
      const sanitize = destroyBuildingPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, territoryId } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyDestroyBuilding(state, playerId, territoryId);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('recruit', async (data, callback) => {
    try {
      const sanitize = recruitPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, territoryId, troopSize } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyRecruit(state, playerId, territoryId, troopSize);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('queueMove', async (data, callback) => {
    try {
      const sanitize = queueMovePayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, armyId, toTerritoryId } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyQueueMove(state, playerId, armyId, toTerritoryId);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('cancelMove', async (data, callback) => {
    try {
      const sanitize = cancelMovePayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, armyId } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyCancelMove(state, playerId, armyId);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });

  socket.on('retreat', async (data, callback) => {
    try {
      const sanitize = retreatPayload.safeParse(data);
      if (!sanitize.success) {
        if (callback) callback({ success: false, error: "Datos invalidos" });
        return;
      }

      const { matchId, playerId, armyId } = sanitize.data;
      const state = getMatch(matchId);
      if (!state) {
        if (callback) callback({ success: false, error: "Partida no encontrada" });
        return;
      }

      const res = gameEngine.applyRetreat(state, playerId, armyId);
      if (res.error) {
        if (callback) callback({ success: false, error: res.error });
        return;
      }

      res.logs.forEach(log => emitGameUpdate(matchId, null, log));
      emitGameUpdate(matchId, res.state, null);

      if (callback) callback({ success: true });
    } catch (error) {
      if (callback) callback({ success: false, error: 'Error interno' });
    }
  });
};

import { createInitialGameState } from './gameFactory.js';
import apiClient from '../config/apiClient.js';


const matchStates = new Map();

function initMatch(matchId, limite, hostId) {
  const initialState = createInitialGameState(matchId, limite);
  initialState.hostId = hostId;
  matchStates.set(matchId, initialState);
  return initialState;
}

function getMatch(matchId) {
  return matchStates.get(matchId) || null;
}

function removeMatch(matchId) {
  matchStates.delete(matchId);
}

// Persistencia en BD via API REST
async function saveSnapshot(matchId) {
  const state = getMatch(matchId);
  if (!state) return false;
  
  try {
    const winnerId = checkWinner(state);
    await apiClient.post('/snapshots/guardar', {
      matchId: parseInt(matchId),
      ronda: state.currentTurn,
      stateJson: JSON.stringify(state),
      idHost: state.hostId || 'unknown',
      idGanador: winnerId
    });
    console.log(`[Snapshot] Partida ${matchId} (Ronda ${state.currentTurn}) guardada en API (Java + MongoDB).`);
    return true;
  } catch (error) {
    console.error(`[Snapshot Error] Fallo al guardar partida ${matchId}:`, error.message);
    return false;
  }
}

async function loadSnapshot(matchId, ronda) {
  try {
    const response = await apiClient.get(`/snapshots/match/${matchId}/ronda/${ronda}`);
    const state = JSON.parse(response.data.stateJson);
    matchStates.set(matchId, state);
    return state;
  } catch (error) {
    console.error(`[Snapshot Error] Fallo al cargar partida ${matchId} ronda ${ronda}:`, error.message);
    return null;
  }
}

async function loadLatestSnapshot(matchId) {
  try {
    const response = await apiClient.get(`/snapshots/match/${matchId}/latest`);
    const state = JSON.parse(response.data.stateJson);
    matchStates.set(matchId, state);
    console.log(`[Snapshot] Partida ${matchId} (Ronda ${state.currentTurn}) restaurada en memoria.`);
    return state;
  } catch (error) {
    console.error(`[Snapshot Error] Fallo al cargar último snapshot de partida ${matchId}:`, error.message);
    return null;
  }
}

function checkWinner(state) {
  // Simple logic: if only one player owns territories, they win.
  const activePlayers = new Set(state.territories.map(t => t.ownerId).filter(id => id !== null));
  if (activePlayers.size === 1) {
    return Array.from(activePlayers)[0];
  }
  return null;
}

export {
  matchStates,
  initMatch,
  getMatch,
  removeMatch,
  saveSnapshot,
  loadSnapshot,
  loadLatestSnapshot
};

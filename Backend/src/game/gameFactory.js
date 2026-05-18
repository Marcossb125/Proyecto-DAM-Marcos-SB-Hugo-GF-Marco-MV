import { buildTerritoriesForPlayerCount } from './mapDefinition.js';


// faction es placeholder para bots; al unirse un humano se sustituye por usuario.Faccion (API).
const ALL_PLAYERS = [
  { id: 'p1', name: 'Bot Alpha', faction: 'Warlord', matchGeneralId: null, color: '#00ff41', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p2', name: 'Bot Delta', faction: 'Trader', matchGeneralId: null, color: '#ff4444', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p3', name: 'Bot Omega', faction: 'Chief', matchGeneralId: null, color: '#4488ff', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p4', name: 'Bot Sigma', faction: 'Scout', matchGeneralId: null, color: '#ffaa00', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
];

const ALL_ARMIES = [
  { id: 'a1', ownerId: 'p1', territoryId: 'A1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a2', ownerId: 'p2', territoryId: 'G7', troopSize: 10, hasActedThisTurn: false },
  { id: 'a3', ownerId: 'p3', territoryId: 'A7', troopSize: 10, hasActedThisTurn: false },
  { id: 'a4', ownerId: 'p4', territoryId: 'G1', troopSize: 10, hasActedThisTurn: false },
];

function createInitialGameState(matchId, limiteJugadores = 4) {
  const count = Math.max(2, Math.min(4, limiteJugadores));

  // Generate map with correct ownership for this player count
  const territories = buildTerritoriesForPlayerCount(count);

  // Only include active players and armies
  const players = JSON.parse(JSON.stringify(ALL_PLAYERS.slice(0, count)));
  const armies = JSON.parse(JSON.stringify(ALL_ARMIES.slice(0, count)));

  // Link armies to territories
  territories.forEach(t => {
    const army = armies.find(a => a.territoryId === t.id);
    if (army) {
      t.occupiedByArmyId = army.id;
    }
  });

  return {
    matchId,
    currentPhase: 'CONSTRUCCION',
    currentTurn: 1,
    isFinished: false,
    winnerId: null,
    limiteJugadores: count,
    players,
    territories,
    armies,
    pendingMoves: [],
    log: []
  };
}

export {
  createInitialGameState
};


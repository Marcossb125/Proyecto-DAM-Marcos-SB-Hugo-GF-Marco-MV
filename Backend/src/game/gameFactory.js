import { INITIAL_TERRITORIES } from './mapDefinition.js';

const INITIAL_PLAYERS = [
  { id: 'p1', name: 'Bot Alpha', faction: 'Warlord', color: '#00ff41', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p2', name: 'Bot Delta', faction: 'Trader', color: '#ff4444', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p3', name: 'Bot Omega', faction: 'Chief', color: '#4488ff', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
  { id: 'p4', name: 'Bot Sigma', faction: 'Scout', color: '#ffaa00', credits: 500, manpower: 200, isReady: false, isBot: true, isConnected: false, socketId: null },
];

const INITIAL_ARMIES = [
  { id: 'a1', ownerId: 'p1', territoryId: 'A1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a2', ownerId: 'p2', territoryId: 'A7', troopSize: 10, hasActedThisTurn: false },
  { id: 'a3', ownerId: 'p3', territoryId: 'G1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a4', ownerId: 'p4', territoryId: 'G7', troopSize: 10, hasActedThisTurn: false },
];

function createInitialGameState(matchId, limiteJugadores = 4) {
  // Deep clone to avoid mutating the static map
  const territories = JSON.parse(JSON.stringify(INITIAL_TERRITORIES));
  const armies = JSON.parse(JSON.stringify(INITIAL_ARMIES));
  const players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));

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
    limiteJugadores,
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

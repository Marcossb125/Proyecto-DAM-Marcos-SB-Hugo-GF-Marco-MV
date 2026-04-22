/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — State Interfaces & Initial State
   ═══════════════════════════════════════════════════════════════ */

// ── Phase & Faction Types ──
export type GamePhase = 'RECAUDACION' | 'CONSTRUCCION' | 'RECLUTAMIENTO' | 'MOVIMIENTO';
export type Faction = 'Warlord' | 'Trader' | 'Chief' | 'Scout';
export type BuildingType = 'CUARTEL' | 'FABRICA' | 'TORRE' | 'MURO' | null;

// ── Player Interface ──
export interface Player {
  id: string;
  name: string;
  faction: Faction;
  color: string;
  credits: number;
  manpower: number;
  isLocal: boolean;
}

// ── Territory Interface ──
export interface Territory {
  id: string;
  label: string;
  ownerId: string | null;
  hasSupremeBase: boolean;
  buildingType: BuildingType;
  occupiedByArmyId: string | null;
  hexQ: number;
  hexR: number;
  adjacentIds: string[];
}

// ── Army Interface ──
export interface Army {
  id: string;
  ownerId: string;
  territoryId: string;
  troopSize: number;
  hasActedThisTurn: boolean;
}

// ── Root Match State ──
export interface MatchState {
  phase: GamePhase;
  currentTurn: number;
  currentPlayerId: string;
  players: Player[];
  territories: Territory[];
  armies: Army[];
  selectedTerritoryId: string | null;
  selectedArmyId: string | null;
  highlightedTerritoryIds: string[];
}

// ── Building Costs ──
export const BUILDING_COSTS: Record<Exclude<BuildingType, null>, { credits: number; manpower: number }> = {
  CUARTEL: { credits: 200, manpower: 0 },
  FABRICA: { credits: 300, manpower: 0 },
  TORRE: { credits: 150, manpower: 0 },
  MURO: { credits: 100, manpower: 0 },
};

// ── Army Recruitment Costs (per troop) ──
export const TROOP_COST = { credits: 50, manpower: 10 };

// ── Resource Collection Base Amounts ──
export const BASE_INCOME = { credits: 100, manpower: 50 };
export const TERRITORY_BONUS = { credits: 20, manpower: 5 };

// ── Initial Mock Data ──
const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'Commander Alpha', faction: 'Warlord', color: '#00ff41', credits: 500, manpower: 200, isLocal: true },
  { id: 'p2', name: 'Baron Delta', faction: 'Trader', color: '#ff4444', credits: 500, manpower: 200, isLocal: false },
  { id: 'p3', name: 'Chief Omega', faction: 'Chief', color: '#4488ff', credits: 500, manpower: 200, isLocal: false },
  { id: 'p4', name: 'Scout Sigma', faction: 'Scout', color: '#ffaa00', credits: 500, manpower: 200, isLocal: false },
];

const INITIAL_TERRITORIES: Territory[] = [
  // Row 0 (top)
  { id: 't1',  label: 'Alpha Post',    hexQ: 0, hexR: 0, ownerId: 'p1', hasSupremeBase: true,  buildingType: null, occupiedByArmyId: null, adjacentIds: ['t2', 't4', 't5'] },
  { id: 't2',  label: 'Bravo Ridge',   hexQ: 1, hexR: 0, ownerId: 'p1', hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t1', 't3', 't5', 't6'] },
  { id: 't3',  label: 'Charlie Peak',  hexQ: 2, hexR: 0, ownerId: 'p2', hasSupremeBase: true,  buildingType: null, occupiedByArmyId: null, adjacentIds: ['t2', 't6', 't7'] },

  // Row 1
  { id: 't4',  label: 'Delta Valley',  hexQ: 0, hexR: 1, ownerId: 'p1', hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t1', 't5', 't8'] },
  { id: 't5',  label: 'Echo Plains',   hexQ: 1, hexR: 1, ownerId: null, hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t1', 't2', 't4', 't6', 't8', 't9'] },
  { id: 't6',  label: 'Foxtrot Hill',  hexQ: 2, hexR: 1, ownerId: null, hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t2', 't3', 't5', 't7', 't9', 't10'] },
  { id: 't7',  label: 'Golf Basin',    hexQ: 3, hexR: 1, ownerId: 'p2', hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t3', 't6', 't10'] },

  // Row 2
  { id: 't8',  label: 'Hotel Marsh',   hexQ: 0, hexR: 2, ownerId: 'p3', hasSupremeBase: true,  buildingType: null, occupiedByArmyId: null, adjacentIds: ['t4', 't5', 't9', 't11'] },
  { id: 't9',  label: 'India Crossing', hexQ: 1, hexR: 2, ownerId: null, hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t5', 't6', 't8', 't10', 't11', 't12'] },
  { id: 't10', label: 'Juliet Fort',   hexQ: 2, hexR: 2, ownerId: null, hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t6', 't7', 't9', 't12'] },

  // Row 3 (bottom)
  { id: 't11', label: 'Kilo Outpost',  hexQ: 0, hexR: 3, ownerId: 'p3', hasSupremeBase: false, buildingType: null, occupiedByArmyId: null, adjacentIds: ['t8', 't9', 't12'] },
  { id: 't12', label: 'Lima Bunker',   hexQ: 1, hexR: 3, ownerId: 'p4', hasSupremeBase: true,  buildingType: null, occupiedByArmyId: null, adjacentIds: ['t9', 't10', 't11'] },
];

const INITIAL_ARMIES: Army[] = [
  { id: 'a1', ownerId: 'p1', territoryId: 't1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a2', ownerId: 'p2', territoryId: 't3', troopSize: 10, hasActedThisTurn: false },
  { id: 'a3', ownerId: 'p3', territoryId: 't8', troopSize: 10, hasActedThisTurn: false },
  { id: 'a4', ownerId: 'p4', territoryId: 't12', troopSize: 10, hasActedThisTurn: false },
];

// Set occupiedByArmyId on initial territories
INITIAL_TERRITORIES.forEach(t => {
  const army = INITIAL_ARMIES.find(a => a.territoryId === t.id);
  if (army) {
    t.occupiedByArmyId = army.id;
  }
});

export const initialMatchState: MatchState = {
  phase: 'RECAUDACION',
  currentTurn: 1,
  currentPlayerId: 'p1',
  players: INITIAL_PLAYERS,
  territories: INITIAL_TERRITORIES,
  armies: INITIAL_ARMIES,
  selectedTerritoryId: null,
  selectedArmyId: null,
  highlightedTerritoryIds: [],
};

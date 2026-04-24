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
  isRefinery: boolean;
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

// ── Refinery Bonus ──
export const REFINERY_BONUS = { credits: 100 };

// ── Initial Players ──
const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'Commander Alpha', faction: 'Warlord', color: '#00ff41', credits: 500, manpower: 200, isLocal: true },
  { id: 'p2', name: 'Baron Delta', faction: 'Trader', color: '#ff4444', credits: 500, manpower: 200, isLocal: false },
  { id: 'p3', name: 'Chief Omega', faction: 'Chief', color: '#4488ff', credits: 500, manpower: 200, isLocal: false },
  { id: 'p4', name: 'Scout Sigma', faction: 'Scout', color: '#ffaa00', credits: 500, manpower: 200, isLocal: false },
];

/* ═══════════════════════════════════════════════════════════════
   41-TERRITORY SYMMETRIC HEX MAP (odd-r offset)
   ═══════════════════════════════════════════════════════════════
   Row 0 (3):  q=1,2,3        P1_HQ . P2_HQ
   Row 1 (4):  q=1,2,3,4      P1 P1 P2 P2
   Row 2 (5):  q=0,1,2,3,4    P1 P1 . P2 P2
   Row 3 (6):  q=0,1,2,3,4,5  . . . . . .
   Row 4 (5):  q=0,1,2,3,4    . . REF . .
   Row 5 (6):  q=0,1,2,3,4,5  . . . . . .
   Row 6 (5):  q=0,1,2,3,4    P3 P3 . P4 P4
   Row 7 (4):  q=1,2,3,4      P3 P3 P4 P4
   Row 8 (3):  q=1,2,3        P3_HQ . P4_HQ
   ═══════════════════════════════════════════════════════════════ */

// Helper to compute adjacency automatically
interface HexDef {
  id: string; label: string; q: number; r: number;
  ownerId: string | null; hasSupremeBase: boolean; isRefinery: boolean;
}

const HEX_DEFS: HexDef[] = [
  // Row 0
  { id: 't01', label: 'Alpha HQ', q: 1, r: 0, ownerId: 'p1', hasSupremeBase: true, isRefinery: false },
  { id: 't02', label: 'Zona Cero', q: 2, r: 0, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't03', label: 'Delta HQ', q: 3, r: 0, ownerId: 'p2', hasSupremeBase: true, isRefinery: false },
  // Row 1
  { id: 't04', label: 'Puesto Noroeste', q: 1, r: 1, ownerId: 'p1', hasSupremeBase: false, isRefinery: false },
  { id: 't05', label: 'Trinchera Alpha', q: 2, r: 1, ownerId: 'p1', hasSupremeBase: false, isRefinery: false },
  { id: 't06', label: 'Trinchera Delta', q: 3, r: 1, ownerId: 'p2', hasSupremeBase: false, isRefinery: false },
  { id: 't07', label: 'Puesto Noreste', q: 4, r: 1, ownerId: 'p2', hasSupremeBase: false, isRefinery: false },
  // Row 2
  { id: 't08', label: 'Fortín Oeste-N', q: 0, r: 2, ownerId: 'p1', hasSupremeBase: false, isRefinery: false },
  { id: 't09', label: 'Meseta Noroeste', q: 1, r: 2, ownerId: 'p1', hasSupremeBase: false, isRefinery: false },
  { id: 't10', label: 'Pradera Norte', q: 2, r: 2, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't11', label: 'Meseta Noreste', q: 3, r: 2, ownerId: 'p2', hasSupremeBase: false, isRefinery: false },
  { id: 't12', label: 'Fortín Este-N', q: 4, r: 2, ownerId: 'p2', hasSupremeBase: false, isRefinery: false },
  // Row 3
  { id: 't13', label: 'Bosque del Lobo', q: 0, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't14', label: 'Cruce Oeste-N', q: 1, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't15', label: 'Valle Norte', q: 2, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't16', label: 'Cruce Este-N', q: 3, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't17', label: 'Paso Montaña-N', q: 4, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't18', label: 'Frontera Norte', q: 5, r: 3, ownerId: null, hasSupremeBase: false, isRefinery: false },
  // Row 4 (CENTER)
  { id: 't19', label: 'Páramo Oeste', q: 0, r: 4, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't20', label: 'Antesala Oeste', q: 1, r: 4, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't21', label: 'REFINERÍA', q: 2, r: 4, ownerId: null, hasSupremeBase: false, isRefinery: true },
  { id: 't22', label: 'Antesala Este', q: 3, r: 4, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't23', label: 'Páramo Este', q: 4, r: 4, ownerId: null, hasSupremeBase: false, isRefinery: false },
  // Row 5
  { id: 't24', label: 'Frontera Sur', q: 0, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't25', label: 'Cruce Oeste-S', q: 1, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't26', label: 'Valle Sur', q: 2, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't27', label: 'Cruce Este-S', q: 3, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't28', label: 'Paso Montaña-S', q: 4, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't29', label: 'Bosque Austral', q: 5, r: 5, ownerId: null, hasSupremeBase: false, isRefinery: false },
  // Row 6
  { id: 't30', label: 'Fortín Oeste-S', q: 0, r: 6, ownerId: 'p3', hasSupremeBase: false, isRefinery: false },
  { id: 't31', label: 'Meseta Suroeste', q: 1, r: 6, ownerId: 'p3', hasSupremeBase: false, isRefinery: false },
  { id: 't32', label: 'Pradera Sur', q: 2, r: 6, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't33', label: 'Meseta Sureste', q: 3, r: 6, ownerId: 'p4', hasSupremeBase: false, isRefinery: false },
  { id: 't34', label: 'Fortín Este-S', q: 4, r: 6, ownerId: 'p4', hasSupremeBase: false, isRefinery: false },
  // Row 7
  { id: 't35', label: 'Puesto Suroeste', q: 1, r: 7, ownerId: 'p3', hasSupremeBase: false, isRefinery: false },
  { id: 't36', label: 'Trinchera Omega', q: 2, r: 7, ownerId: 'p3', hasSupremeBase: false, isRefinery: false },
  { id: 't37', label: 'Trinchera Sigma', q: 3, r: 7, ownerId: 'p4', hasSupremeBase: false, isRefinery: false },
  { id: 't38', label: 'Puesto Sureste', q: 4, r: 7, ownerId: 'p4', hasSupremeBase: false, isRefinery: false },
  // Row 8
  { id: 't39', label: 'Omega HQ', q: 1, r: 8, ownerId: 'p3', hasSupremeBase: true, isRefinery: false },
  { id: 't40', label: 'Zona Sur', q: 2, r: 8, ownerId: null, hasSupremeBase: false, isRefinery: false },
  { id: 't41', label: 'Sigma HQ', q: 3, r: 8, ownerId: 'p4', hasSupremeBase: true, isRefinery: false },
];

// Build coordinate lookup and compute adjacencies
function buildTerritories(): Territory[] {
  const coordMap = new Map<string, string>();
  HEX_DEFS.forEach(h => coordMap.set(`${h.q},${h.r}`, h.id));

  function getNeighborIds(q: number, r: number): string[] {
    const isOddRow = r % 2 === 1;
    const dirs = isOddRow
      ? [[+1, 0], [-1, 0], [0, -1], [+1, -1], [0, +1], [+1, +1]]
      : [[+1, 0], [-1, 0], [0, -1], [-1, -1], [0, +1], [-1, +1]];
    const ids: string[] = [];
    for (const [dq, dr] of dirs) {
      const key = `${q + dq},${r + dr}`;
      const id = coordMap.get(key);
      if (id) ids.push(id);
    }
    return ids;
  }

  return HEX_DEFS.map(h => ({
    id: h.id,
    label: h.label,
    hexQ: h.q,
    hexR: h.r,
    ownerId: h.ownerId,
    hasSupremeBase: h.hasSupremeBase,
    buildingType: null as BuildingType,
    occupiedByArmyId: null as string | null,
    adjacentIds: getNeighborIds(h.q, h.r),
    isRefinery: h.isRefinery,
  }));
}

const INITIAL_TERRITORIES: Territory[] = buildTerritories();

const INITIAL_ARMIES: Army[] = [
  { id: 'a1', ownerId: 'p1', territoryId: 't01', troopSize: 10, hasActedThisTurn: false },
  { id: 'a2', ownerId: 'p2', territoryId: 't03', troopSize: 10, hasActedThisTurn: false },
  { id: 'a3', ownerId: 'p3', territoryId: 't39', troopSize: 10, hasActedThisTurn: false },
  { id: 'a4', ownerId: 'p4', territoryId: 't41', troopSize: 10, hasActedThisTurn: false },
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

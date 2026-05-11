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
  localPlayerId: string | null;
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
   7x7 SQUARE-ARRANGED HEX MAP (Battleship Coordinates)
   ═══════════════════════════════════════════════════════════════
   Grid: A1 to G7 (49 territories)
   - P1_HQ: A1 (Top-Left)
   - P2_HQ: A7 (Top-Right)
   - P3_HQ: G1 (Bottom-Left)
   - P4_HQ: G7 (Bottom-Right)
   - REFINERY: D4 (Center)
   ═══════════════════════════════════════════════════════════════ */

// Helper to compute adjacency automatically
interface HexDef {
  id: string; label: string; q: number; r: number;
  ownerId: string | null; hasSupremeBase: boolean; isRefinery: boolean;
}

function generateSquareMap(): HexDef[] {
  const defs: HexDef[] = [];
  const size = 7;
  for (let r = 0; r < size; r++) {
    for (let q = 0; q < size; q++) {
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      const colNum = q + 1; // 1, 2, 3...
      const id = `${rowChar}${colNum}`;

      let ownerId: string | null = null;
      let hasSupremeBase = false;
      let isRefinery = false;

      // Corners: Supreme Bases
      if (r === 0 && q === 0) { ownerId = 'p1'; hasSupremeBase = true; }
      else if (r === 0 && q === 6) { ownerId = 'p2'; hasSupremeBase = true; }
      else if (r === 6 && q === 0) { ownerId = 'p3'; hasSupremeBase = true; }
      else if (r === 6 && q === 6) { ownerId = 'p4'; hasSupremeBase = true; }

      // Center: Refinery
      else if (r === 3 && q === 3) { isRefinery = true; }

      // Extra Faction Territories (at least one more per faction)
      else if ((r === 0 && q === 1) || (r === 1 && q === 0)) { ownerId = 'p1'; } // Near P1
      else if ((r === 0 && q === 5) || (r === 1 && q === 6)) { ownerId = 'p2'; } // Near P2
      else if ((r === 6 && q === 1) || (r === 5 && q === 0)) { ownerId = 'p3'; } // Near P3
      else if ((r === 6 && q === 5) || (r === 5 && q === 6)) { ownerId = 'p4'; } // Near P4

      defs.push({ id, label: id, q, r, ownerId, hasSupremeBase, isRefinery });
    }
  }
  return defs;
}

const HEX_DEFS: HexDef[] = generateSquareMap();

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
  { id: 'a1', ownerId: 'p1', territoryId: 'A1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a2', ownerId: 'p2', territoryId: 'A7', troopSize: 10, hasActedThisTurn: false },
  { id: 'a3', ownerId: 'p3', territoryId: 'G1', troopSize: 10, hasActedThisTurn: false },
  { id: 'a4', ownerId: 'p4', territoryId: 'G7', troopSize: 10, hasActedThisTurn: false },
];

// Set occupiedByArmyId on initial territories
INITIAL_TERRITORIES.forEach(t => {
  const army = INITIAL_ARMIES.find(a => a.territoryId === t.id);
  if (army) {
    t.occupiedByArmyId = army.id;
  }
});

export const initialMatchState: MatchState = {
  phase: 'CONSTRUCCION',
  currentTurn: 1,
  currentPlayerId: 'p1',
  players: INITIAL_PLAYERS,
  territories: INITIAL_TERRITORIES,
  armies: INITIAL_ARMIES,
  selectedTerritoryId: null,
  selectedArmyId: null,
  highlightedTerritoryIds: [],
  localPlayerId: null,
};


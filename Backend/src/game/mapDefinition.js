// 7x7 SQUARE-ARRANGED HEX MAP (Battleship Coordinates)
// Corner assignment:
//   p1 = top-left    (A1)  — always present
//   p2 = bottom-right (G7) — always present
//   p3 = top-right   (A7)  — present with 3+ players
//   p4 = bottom-left (G1)  — present with 4 players only
function generateSquareMap(playerCount = 4) {
  const defs = [];
  const size = 7;
  for (let r = 0; r < size; r++) {
    for (let q = 0; q < size; q++) {
      const rowChar = String.fromCharCode(65 + r); // A, B, C...
      const colNum = q + 1; // 1, 2, 3...
      const id = `${rowChar}${colNum}`;

      let ownerId = null;
      let hasSupremeBase = false;
      let isRefinery = false;

      // Corners: Supreme Bases
      // p1 = top-left (A1)
      if (r === 0 && q === 0) { ownerId = 'p1'; hasSupremeBase = true; }
      // p2 = bottom-right (G7)
      else if (r === 6 && q === 6) { ownerId = 'p2'; hasSupremeBase = true; }
      // p3 = top-right (A7) — only with 3+ players
      else if (r === 0 && q === 6 && playerCount >= 3) { ownerId = 'p3'; hasSupremeBase = true; }
      // p4 = bottom-left (G1) — only with 4 players
      else if (r === 6 && q === 0 && playerCount >= 4) { ownerId = 'p4'; hasSupremeBase = true; }

      // Center: Refinery
      else if (r === 3 && q === 3) { isRefinery = true; }

      // Extra Faction Territories (at least one more per faction)
      else if ((r === 0 && q === 1) || (r === 1 && q === 0)) { ownerId = 'p1'; }
      else if ((r === 6 && q === 5) || (r === 5 && q === 6)) { ownerId = 'p2'; }
      else if (playerCount >= 3 && ((r === 0 && q === 5) || (r === 1 && q === 6))) { ownerId = 'p3'; }
      else if (playerCount >= 4 && ((r === 6 && q === 1) || (r === 5 && q === 0))) { ownerId = 'p4'; }

      defs.push({ id, label: id, q, r, ownerId, hasSupremeBase, isRefinery });
    }
  }
  return defs;
}

// HEX_DEFS is generated per-game via buildTerritoriesForPlayerCount()
const HEX_DEFS = generateSquareMap(); // default 4-player for reference

function buildTerritories() {
  const coordMap = new Map();
  HEX_DEFS.forEach(h => coordMap.set(`${h.q},${h.r}`, h.id));

  function getNeighborIds(q, r) {
    const isOddRow = r % 2 === 1;
    const dirs = isOddRow
      ? [[+1, 0], [-1, 0], [0, -1], [+1, -1], [0, +1], [+1, +1]]
      : [[+1, 0], [-1, 0], [0, -1], [-1, -1], [0, +1], [-1, +1]];
    const ids = [];
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
    buildingType: null,
    occupiedByArmyId: null,
    adjacentIds: getNeighborIds(h.q, h.r),
    isRefinery: h.isRefinery,
  }));
}

function buildTerritoriesForPlayerCount(playerCount) {
  const hexDefs = generateSquareMap(playerCount);
  const coordMap = new Map();
  hexDefs.forEach(h => coordMap.set(`${h.q},${h.r}`, h.id));

  function getNeighborIds(q, r) {
    const isOddRow = r % 2 === 1;
    const dirs = isOddRow
      ? [[+1, 0], [-1, 0], [0, -1], [+1, -1], [0, +1], [+1, +1]]
      : [[+1, 0], [-1, 0], [0, -1], [-1, -1], [0, +1], [-1, +1]];
    const ids = [];
    for (const [dq, dr] of dirs) {
      const key = `${q + dq},${r + dr}`;
      const id = coordMap.get(key);
      if (id) ids.push(id);
    }
    return ids;
  }

  return hexDefs.map(h => ({
    id: h.id,
    label: h.label,
    hexQ: h.q,
    hexR: h.r,
    ownerId: h.ownerId,
    hasSupremeBase: h.hasSupremeBase,
    buildingType: null,
    occupiedByArmyId: null,
    adjacentIds: getNeighborIds(h.q, h.r),
    isRefinery: h.isRefinery,
  }));
}

const INITIAL_TERRITORIES = buildTerritories();

export {
  HEX_DEFS,
  INITIAL_TERRITORIES,
  buildTerritoriesForPlayerCount
};

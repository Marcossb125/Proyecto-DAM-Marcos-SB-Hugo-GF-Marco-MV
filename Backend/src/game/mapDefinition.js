// 7x7 SQUARE-ARRANGED HEX MAP (Battleship Coordinates)
function generateSquareMap() {
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
      if (r === 0 && q === 0) { ownerId = 'p1'; hasSupremeBase = true; }
      else if (r === 0 && q === 6) { ownerId = 'p2'; hasSupremeBase = true; }
      else if (r === 6 && q === 0) { ownerId = 'p3'; hasSupremeBase = true; }
      else if (r === 6 && q === 6) { ownerId = 'p4'; hasSupremeBase = true; }

      // Center: Refinery
      else if (r === 3 && q === 3) { isRefinery = true; }

      // Extra Faction Territories (at least one more per faction)
      else if ((r === 0 && q === 1) || (r === 1 && q === 0)) { ownerId = 'p1'; }
      else if ((r === 0 && q === 5) || (r === 1 && q === 6)) { ownerId = 'p2'; }
      else if ((r === 6 && q === 1) || (r === 5 && q === 0)) { ownerId = 'p3'; }
      else if ((r === 6 && q === 5) || (r === 5 && q === 6)) { ownerId = 'p4'; }

      defs.push({ id, label: id, q, r, ownerId, hasSupremeBase, isRefinery });
    }
  }
  return defs;
}

const HEX_DEFS = generateSquareMap();

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

const INITIAL_TERRITORIES = buildTerritories();

export {
  HEX_DEFS,
  INITIAL_TERRITORIES
};

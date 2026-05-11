// 41-TERRITORY SYMMETRIC HEX MAP (odd-r offset)
const HEX_DEFS = [
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

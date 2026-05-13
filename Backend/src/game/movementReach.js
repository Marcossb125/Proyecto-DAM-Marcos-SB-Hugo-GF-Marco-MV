/**
 * Graph distance on territory adjacency. maxDistance = 1 → only adjacent; = 2 → two steps.
 * Does not include the starting territory.
 */
function reachableTerritoryIds(state, fromTerritoryId, maxDistance) {
  if (!fromTerritoryId || maxDistance < 1) return [];

  const visited = new Set([fromTerritoryId]);
  let frontier = [fromTerritoryId];
  const result = new Set();

  for (let d = 0; d < maxDistance; d++) {
    const nextFrontier = [];
    for (const fid of frontier) {
      const t = state.territories.find((x) => x.id === fid);
      if (!t || !Array.isArray(t.adjacentIds)) continue;
      for (const nid of t.adjacentIds) {
        if (visited.has(nid)) continue;
        visited.add(nid);
        result.add(nid);
        nextFrontier.push(nid);
      }
    }
    frontier = nextFrontier;
  }

  return [...result];
}

function getMovementMaxSteps(state, moverPlayerId) {
  const p = state.players.find((x) => x.id === moverPlayerId);
  return p && p.matchGeneralId === 1 ? 2 : 1;
}

function isTerritoryReachableForMove(state, fromTerritoryId, toTerritoryId, moverPlayerId) {
  const max = getMovementMaxSteps(state, moverPlayerId);
  const ids = reachableTerritoryIds(state, fromTerritoryId, max);
  return ids.includes(toTerritoryId);
}

export { reachableTerritoryIds, getMovementMaxSteps, isTerritoryReachableForMove };

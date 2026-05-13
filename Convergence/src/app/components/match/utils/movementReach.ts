export interface ReachPlayer {
  id: string;
  matchGeneralId?: number | null;
}

export interface ReachTerritory {
  id: string;
  adjacentIds: string[];
}

export function reachableTerritoryIds(
  territories: ReachTerritory[],
  fromTerritoryId: string,
  maxDistance: number
): string[] {
  if (!fromTerritoryId || maxDistance < 1) return [];

  const visited = new Set<string>([fromTerritoryId]);
  let frontier: string[] = [fromTerritoryId];
  const result = new Set<string>();

  for (let d = 0; d < maxDistance; d++) {
    const nextFrontier: string[] = [];
    for (const fid of frontier) {
      const t = territories.find((x) => x.id === fid);
      if (!t?.adjacentIds?.length) continue;
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

export function getMovementMaxSteps(players: ReachPlayer[], moverPlayerId: string): number {
  const p = players.find((x) => x.id === moverPlayerId);
  return p?.matchGeneralId === 1 ? 2 : 1;
}

export function movementHighlightIds(
  territories: ReachTerritory[],
  players: ReachPlayer[],
  fromTerritoryId: string,
  moverPlayerId: string
): string[] {
  const max = getMovementMaxSteps(players, moverPlayerId);
  return reachableTerritoryIds(territories, fromTerritoryId, max);
}

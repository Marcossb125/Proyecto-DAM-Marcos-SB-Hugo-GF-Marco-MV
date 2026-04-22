/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — NgRx Selectors
   ═══════════════════════════════════════════════════════════════ */

import { createSelector } from '@ngrx/store';
import {
  selectMatchState,
  selectPhase,
  selectCurrentPlayerId,
  selectPlayers,
  selectTerritories,
  selectArmies,
  selectSelectedTerritoryId,
  selectSelectedArmyId,
  selectHighlightedTerritoryIds,
} from './match.reducer';

// Re-export basic selectors from the feature
export {
  selectPhase,
  selectCurrentPlayerId,
  selectPlayers,
  selectTerritories,
  selectArmies,
  selectSelectedTerritoryId,
  selectSelectedArmyId,
  selectHighlightedTerritoryIds,
} from './match.reducer';

export { selectMatchState } from './match.reducer';

// ── Derived Selectors ──

/** Current player object */
export const selectCurrentPlayer = createSelector(
  selectPlayers,
  selectCurrentPlayerId,
  (players, currentId) => players.find(p => p.id === currentId) ?? null
);

/** Local (human) player object */
export const selectLocalPlayer = createSelector(
  selectPlayers,
  (players) => players.find(p => p.isLocal) ?? null
);

/** Is it the local player's turn? */
export const selectIsLocalTurn = createSelector(
  selectCurrentPlayerId,
  selectLocalPlayer,
  (currentId, local) => local ? currentId === local.id : false
);

/** Territories owned by the current player */
export const selectPlayerTerritories = createSelector(
  selectTerritories,
  selectCurrentPlayerId,
  (territories, playerId) => territories.filter(t => t.ownerId === playerId)
);

/** Territories owned by the local player */
export const selectLocalPlayerTerritories = createSelector(
  selectTerritories,
  selectLocalPlayer,
  (territories, player) => player ? territories.filter(t => t.ownerId === player.id) : []
);

/** Selected territory object */
export const selectSelectedTerritory = createSelector(
  selectTerritories,
  selectSelectedTerritoryId,
  (territories, selectedId) => selectedId ? territories.find(t => t.id === selectedId) ?? null : null
);

/** Selected army object */
export const selectSelectedArmy = createSelector(
  selectArmies,
  selectSelectedArmyId,
  (armies, selectedId) => selectedId ? armies.find(a => a.id === selectedId) ?? null : null
);

/** Armies belonging to the current player */
export const selectPlayerArmies = createSelector(
  selectArmies,
  selectCurrentPlayerId,
  (armies, playerId) => armies.filter(a => a.ownerId === playerId)
);

/** Can the current player build? (has supreme base and owned territories) */
export const selectCanBuild = createSelector(
  selectPlayerTerritories,
  (territories) => territories.some(t => t.hasSupremeBase) && territories.length > 0
);

/** Does the current player have a supreme base? (for recruitment) */
export const selectHasSupremeBase = createSelector(
  selectPlayerTerritories,
  (territories) => territories.find(t => t.hasSupremeBase) ?? null
);

/** Current turn number */
export const selectCurrentTurn = createSelector(
  selectMatchState,
  (state) => state.currentTurn
);

/** Full map render data: territories with army info merged */
export const selectMapRenderData = createSelector(
  selectTerritories,
  selectArmies,
  selectPlayers,
  selectHighlightedTerritoryIds,
  selectSelectedTerritoryId,
  (territories, armies, players, highlightedIds, selectedId) => {
    return territories.map(t => {
      const army = armies.find(a => a.territoryId === t.id);
      const owner = players.find(p => p.id === t.ownerId);
      return {
        ...t,
        army: army ?? null,
        ownerColor: owner?.color ?? null,
        ownerName: owner?.name ?? null,
        isHighlighted: highlightedIds.includes(t.id),
        isSelected: t.id === selectedId,
      };
    });
  }
);

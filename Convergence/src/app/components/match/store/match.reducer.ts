/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — NgRx Reducer
   ═══════════════════════════════════════════════════════════════ */

import { createFeature, createReducer, on } from '@ngrx/store';
import {
  MatchState,
  initialMatchState,
  BASE_INCOME,
  TERRITORY_BONUS,
} from './match.state';
import {
  PhaseActions,
  ResourceActions,
  BuildingActions,
  ArmyActions,
  CombatActions,
  CityActions,
  MapActions,
} from './match.actions';

export const matchFeature = createFeature({
  name: 'match',
  reducer: createReducer(
    initialMatchState,

    // ═══ PHASE TRANSITIONS ═══

    on(PhaseActions.continueFromRecaudacion, (state): MatchState => {
      // Collect resources for current player
      const player = state.players.find(p => p.id === state.currentPlayerId);
      if (!player) return state;

      const ownedTerritories = state.territories.filter(t => t.ownerId === state.currentPlayerId);
      const creditBonus = BASE_INCOME.credits + (ownedTerritories.length * TERRITORY_BONUS.credits);
      const manpowerBonus = BASE_INCOME.manpower + (ownedTerritories.length * TERRITORY_BONUS.manpower);

      return {
        ...state,
        phase: 'CONSTRUCCION',
        players: state.players.map(p =>
          p.id === state.currentPlayerId
            ? { ...p, credits: p.credits + creditBonus, manpower: p.manpower + manpowerBonus }
            : p
        ),
        selectedTerritoryId: null,
        selectedArmyId: null,
        highlightedTerritoryIds: [],
      };
    }),

    on(PhaseActions.finishConstruccion, (state): MatchState => ({
      ...state,
      phase: 'RECLUTAMIENTO',
      selectedTerritoryId: null,
      selectedArmyId: null,
      highlightedTerritoryIds: [],
    })),

    on(PhaseActions.finishReclutamiento, (state): MatchState => ({
      ...state,
      phase: 'MOVIMIENTO',
      selectedTerritoryId: null,
      selectedArmyId: null,
      highlightedTerritoryIds: [],
    })),

    on(PhaseActions.finishMovimiento, (state): MatchState => {
      // Advance to next player or next turn
      const playerIdx = state.players.findIndex(p => p.id === state.currentPlayerId);
      const nextIdx = (playerIdx + 1) % state.players.length;
      const isNewTurn = nextIdx === 0;

      return {
        ...state,
        phase: 'RECAUDACION',
        currentPlayerId: state.players[nextIdx].id,
        currentTurn: isNewTurn ? state.currentTurn + 1 : state.currentTurn,
        armies: state.armies.map(a => ({ ...a, hasActedThisTurn: false })),
        selectedTerritoryId: null,
        selectedArmyId: null,
        highlightedTerritoryIds: [],
      };
    }),

    // ═══ RESOURCES ═══

    on(ResourceActions.collectResources, (state, { playerId, creditBonus, manpowerBonus }): MatchState => ({
      ...state,
      players: state.players.map(p =>
        p.id === playerId
          ? { ...p, credits: p.credits + creditBonus, manpower: p.manpower + manpowerBonus }
          : p
      ),
    })),

    // ═══ BUILDING ═══

    on(BuildingActions.buildOnTerritory, (state, { territoryId, buildingType, cost }): MatchState => ({
      ...state,
      territories: state.territories.map(t =>
        t.id === territoryId ? { ...t, buildingType } : t
      ),
      players: state.players.map(p =>
        p.id === state.currentPlayerId
          ? { ...p, credits: p.credits - cost }
          : p
      ),
    })),

    on(BuildingActions.destroyBuilding, (state, { territoryId }): MatchState => ({
      ...state,
      territories: state.territories.map(t =>
        t.id === territoryId ? { ...t, buildingType: null } : t
      ),
    })),

    // ═══ ARMY ═══

    on(ArmyActions.createArmy, (state, { territoryId, troopSize, creditsCost, manpowerCost }): MatchState => {
      const newArmyId = 'a' + (state.armies.length + 1) + '_' + Date.now();
      const newArmy = {
        id: newArmyId,
        ownerId: state.currentPlayerId,
        territoryId,
        troopSize,
        hasActedThisTurn: false,
      };

      return {
        ...state,
        armies: [...state.armies, newArmy],
        territories: state.territories.map(t =>
          t.id === territoryId ? { ...t, occupiedByArmyId: newArmyId } : t
        ),
        players: state.players.map(p =>
          p.id === state.currentPlayerId
            ? { ...p, credits: p.credits - creditsCost, manpower: p.manpower - manpowerCost }
            : p
        ),
      };
    }),

    on(ArmyActions.moveArmy, (state, { armyId, toTerritoryId }): MatchState => {
      const army = state.armies.find(a => a.id === armyId);
      if (!army) return state;

      const fromTerritoryId = army.territoryId;

      return {
        ...state,
        armies: state.armies.map(a =>
          a.id === armyId
            ? { ...a, territoryId: toTerritoryId, hasActedThisTurn: true }
            : a
        ),
        territories: state.territories.map(t => {
          if (t.id === fromTerritoryId) return { ...t, occupiedByArmyId: null };
          if (t.id === toTerritoryId) return { ...t, occupiedByArmyId: armyId, ownerId: army.ownerId };
          return t;
        }),
        selectedArmyId: null,
        highlightedTerritoryIds: [],
      };
    }),

    on(ArmyActions.destroyArmy, (state, { armyId }): MatchState => {
      const army = state.armies.find(a => a.id === armyId);
      return {
        ...state,
        armies: state.armies.filter(a => a.id !== armyId),
        territories: state.territories.map(t =>
          t.occupiedByArmyId === armyId ? { ...t, occupiedByArmyId: null } : t
        ),
        selectedArmyId: state.selectedArmyId === armyId ? null : state.selectedArmyId,
      };
    }),

    // ═══ COMBAT ═══

    on(CombatActions.resolveBattle, (state, { winnerArmyId, loserArmyId, territoryId }): MatchState => {
      const winner = state.armies.find(a => a.id === winnerArmyId);
      if (!winner) return state;

      // Remove loser, move winner to territory, reduce winner troops by 20%
      const survivingTroops = Math.max(1, Math.floor(winner.troopSize * 0.8));

      return {
        ...state,
        armies: state.armies
          .filter(a => a.id !== loserArmyId)
          .map(a => a.id === winnerArmyId
            ? { ...a, territoryId, troopSize: survivingTroops, hasActedThisTurn: true }
            : a
          ),
        territories: state.territories.map(t => {
          if (t.id === territoryId) {
            return { ...t, occupiedByArmyId: winnerArmyId, ownerId: winner.ownerId };
          }
          // Clear winner's old position
          if (t.occupiedByArmyId === winnerArmyId) {
            return { ...t, occupiedByArmyId: null };
          }
          return t;
        }),
        selectedArmyId: null,
        highlightedTerritoryIds: [],
      };
    }),

    on(CombatActions.retreat, (state, { armyId }): MatchState => ({
      ...state,
      armies: state.armies.map(a =>
        a.id === armyId ? { ...a, hasActedThisTurn: true } : a
      ),
      selectedArmyId: null,
      highlightedTerritoryIds: [],
    })),

    // ═══ CITY CONQUEST ═══

    on(CityActions.conquestCity, (state, { armyId, territoryId, success }): MatchState => {
      if (!success) {
        // Failed conquest — destroy army
        return {
          ...state,
          armies: state.armies.filter(a => a.id !== armyId),
          selectedArmyId: null,
          highlightedTerritoryIds: [],
        };
      }

      const army = state.armies.find(a => a.id === armyId);
      if (!army) return state;

      return {
        ...state,
        armies: state.armies.map(a =>
          a.id === armyId
            ? { ...a, territoryId, hasActedThisTurn: true, troopSize: Math.max(1, Math.floor(a.troopSize * 0.7)) }
            : a
        ),
        territories: state.territories.map(t => {
          if (t.id === territoryId) {
            return { ...t, occupiedByArmyId: armyId, ownerId: army.ownerId };
          }
          if (t.occupiedByArmyId === armyId) {
            return { ...t, occupiedByArmyId: null };
          }
          return t;
        }),
        selectedArmyId: null,
        highlightedTerritoryIds: [],
      };
    }),

    // ═══ MAP INTERACTIONS ═══

    on(MapActions.selectTerritory, (state, { territoryId }): MatchState => ({
      ...state,
      selectedTerritoryId: territoryId,
    })),

    on(MapActions.selectArmy, (state, { armyId }): MatchState => {
      const army = state.armies.find(a => a.id === armyId);
      if (!army) return state;

      // Highlight adjacent territories for movement
      const territory = state.territories.find(t => t.id === army.territoryId);
      const adjacentIds = territory ? territory.adjacentIds : [];

      return {
        ...state,
        selectedArmyId: armyId,
        selectedTerritoryId: army.territoryId,
        highlightedTerritoryIds: adjacentIds,
      };
    }),

    on(MapActions.clearSelection, (state): MatchState => ({
      ...state,
      selectedTerritoryId: null,
      selectedArmyId: null,
      highlightedTerritoryIds: [],
    })),

    on(MapActions.highlightTerritories, (state, { territoryIds }): MatchState => ({
      ...state,
      highlightedTerritoryIds: territoryIds,
    })),
  ),
});

// Export reducer and selectors from the feature
export const {
  name: matchFeatureKey,
  reducer: matchReducer,
  selectMatchState,
  selectPhase,
  selectCurrentTurn,
  selectCurrentPlayerId,
  selectPlayers,
  selectTerritories,
  selectArmies,
  selectSelectedTerritoryId,
  selectSelectedArmyId,
  selectHighlightedTerritoryIds,
} = matchFeature;

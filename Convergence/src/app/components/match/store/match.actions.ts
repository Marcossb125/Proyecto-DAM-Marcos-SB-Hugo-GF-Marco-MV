/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — NgRx Actions
   ═══════════════════════════════════════════════════════════════ */

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BuildingType } from './match.state';

// ── Phase Actions ──
export const PhaseActions = createActionGroup({
  source: 'Match Phase',
  events: {
    'Continue From Recaudacion': emptyProps(),
    'Finish Construccion': emptyProps(),
    'Finish Reclutamiento': emptyProps(),
    'Finish Movimiento': emptyProps(),
  },
});

// ── Resource Actions ──
export const ResourceActions = createActionGroup({
  source: 'Match Resources',
  events: {
    'Collect Resources': props<{ playerId: string; creditBonus: number; manpowerBonus: number }>(),
  },
});

// ── Building Actions ──
export const BuildingActions = createActionGroup({
  source: 'Match Building',
  events: {
    'Build On Territory': props<{ territoryId: string; buildingType: Exclude<BuildingType, null>; cost: number }>(),
    'Destroy Building': props<{ territoryId: string }>(),
  },
});

// ── Army Actions ──
export const ArmyActions = createActionGroup({
  source: 'Match Army',
  events: {
    'Create Army': props<{ territoryId: string; troopSize: number; creditsCost: number; manpowerCost: number }>(),
    'Move Army': props<{ armyId: string; toTerritoryId: string }>(),
    'Destroy Army': props<{ armyId: string }>(),
  },
});

// ── Combat Actions ──
export const CombatActions = createActionGroup({
  source: 'Match Combat',
  events: {
    'Start Battle': props<{ attackerArmyId: string; defenderArmyId: string; territoryId: string }>(),
    'Resolve Battle': props<{ winnerArmyId: string; loserArmyId: string; territoryId: string }>(),
    'Retreat': props<{ armyId: string; fromTerritoryId: string }>(),
  },
});

// ── City / Conquest Actions ──
export const CityActions = createActionGroup({
  source: 'Match City',
  events: {
    'Conquest City': props<{ armyId: string; territoryId: string; success: boolean }>(),
    'Ignore City': emptyProps(),
  },
});

// ── Map Interaction Actions ──
export const MapActions = createActionGroup({
  source: 'Match Map',
  events: {
    'Select Territory': props<{ territoryId: string }>(),
    'Select Army': props<{ armyId: string }>(),
    'Clear Selection': emptyProps(),
    'Highlight Territories': props<{ territoryIds: string[] }>(),
  },
});

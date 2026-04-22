/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — NgRx Effects
   ═══════════════════════════════════════════════════════════════ */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { MapActions, PhaseActions } from './match.actions';
import { selectPhase, selectArmies, selectTerritories, selectCurrentPlayerId } from './match.selectors';

@Injectable()
export class MatchEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  /** When an army is selected during MOVIMIENTO phase, highlight adjacent territories */
  highlightOnArmySelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.selectArmy),
      withLatestFrom(
        this.store.select(selectPhase),
        this.store.select(selectArmies),
        this.store.select(selectTerritories),
        this.store.select(selectCurrentPlayerId),
      ),
      tap(([action, phase, armies, territories, currentPlayerId]) => {
        if (phase !== 'MOVIMIENTO') return;

        const army = armies.find(a => a.id === action.armyId);
        if (!army || army.ownerId !== currentPlayerId || army.hasActedThisTurn) return;

        const territory = territories.find(t => t.id === army.territoryId);
        if (!territory) return;

        this.store.dispatch(MapActions.highlightTerritories({
          territoryIds: territory.adjacentIds,
        }));
      }),
    ),
    { dispatch: false }
  );

  /** Log phase transitions for debugging */
  logPhaseChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PhaseActions.continueFromRecaudacion,
        PhaseActions.finishConstruccion,
        PhaseActions.finishReclutamiento,
        PhaseActions.finishMovimiento,
      ),
      tap((action) => {
        console.log('[MatchEffects] Phase transition:', action.type);
      }),
    ),
    { dispatch: false }
  );
}

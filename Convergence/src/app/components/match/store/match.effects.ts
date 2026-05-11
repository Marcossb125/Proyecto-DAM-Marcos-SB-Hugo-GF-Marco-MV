/* ═══════════════════════════════════════════════════════════════
   MATCH MODULE — NgRx Effects
   ═══════════════════════════════════════════════════════════════ */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { MapActions, PhaseActions, MatchSocketActions } from './match.actions';
import { selectPhase, selectArmies, selectTerritories, selectLocalPlayer } from './match.selectors';
import { SocketService } from '../../../servicios/socket.service';

@Injectable()
export class MatchEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly socketService = inject(SocketService);

  /** When joining a match, emit the event to the server */
  joinMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchSocketActions.joinMatch),
      tap(({ matchId, playerId }) => {
        this.socketService.emitWithCallback('joinMatch', { matchId, playerId }, (res: any) => {
          if (res && !res.success) {
            console.error('Error joining match:', res.error);
            alert('Error al unirse a la partida: ' + res.error);
          }
        });
      })
    ),
    { dispatch: false }
  );

  /** Listen for state updates from the server via the Subject in SocketService */
  listenToStateUpdates$ = createEffect(() =>
    this.socketService.gameStateUpdates$.pipe(
      tap(state => {
        console.log('[MatchEffects] GAME_STATE_UPDATE recibido. Fase:', state?.currentPhase);
        this.store.dispatch(MatchSocketActions.updateState({ state }));
      }),
    ),
    { dispatch: false }
  );

  /** Proxy actions to the server */
  syncActionsToServer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchSocketActions.syncAction),
      tap(({ action, data }) => {
        this.socketService.emitWithCallback(action, data, (res: any) => {
          if (res && !res.success) {
            console.error(`[MatchEffects] Error en acción '${action}':`, res.error);
            alert(`Error: ${res.error}`);
          } else if (res && res.success) {
            console.log(`[MatchEffects] Acción '${action}' ejecutada correctamente`);
          }
        });
      })
    ),
    { dispatch: false }
  );

  /** When an army is selected during MOVIMIENTO phase, highlight adjacent territories */
  highlightOnArmySelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.selectArmy),
      withLatestFrom(
        this.store.select(selectPhase),
        this.store.select(selectArmies),
        this.store.select(selectTerritories),
        this.store.select(selectLocalPlayer),
      ),
      tap(([action, phase, armies, territories, localPlayer]) => {
        if (phase !== 'MOVIMIENTO') return;
        if (!localPlayer) return;

        const army = armies.find(a => a.id === action.armyId);
        if (!army || army.ownerId !== localPlayer.id || army.hasActedThisTurn) return;

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

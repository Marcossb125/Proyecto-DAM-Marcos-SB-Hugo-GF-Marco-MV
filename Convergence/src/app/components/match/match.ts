/* ═══════════════════════════════════════════════════════════════
   MATCH COMPONENT — Main Game Container
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter, withLatestFrom, pairwise, startWith } from 'rxjs/operators';

import { MapComponent } from './map/map';
import { HudComponent } from './hud/hud';
import { AuthService } from '../../servicios/auth.service';
import { SocketService } from '../../servicios/socket.service';

import {
  MapActions,
  CombatActions,
  CityActions,
  MatchSocketActions,
} from './store/match.actions';
import {
  selectPhase,
  selectSelectedTerritoryId,
  selectSelectedArmyId,
  selectTerritories,
  selectArmies,
  selectLocalPlayer,
  selectHighlightedTerritoryIds,
  selectPlayers,
  selectIsFinished,
  selectWinnerId,
} from './store/match.selectors';
import { Territory, Army, Player } from './store/match.state';

import { BuildDialog, BuildDialogResult } from './dialogs/build22/build-dialog.component';
import { RecruitDialog, RecruitDialogResult } from './dialogs/recruit/recruit-dialog.component';
import { BattleDialog, BattleDialogResult } from './dialogs/battle/battle-dialog.component';
import { CityDialog, CityDialogResult } from './dialogs/city/city-dialog.component';
import { WinnerDialog } from './dialogs/winner/winner-dialog.component';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, MapComponent, HudComponent, MatDialogModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly socketService = inject(SocketService);
  private subscriptions: Subscription[] = [];
  private winnerModalShown = false;

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    const playerId = this.authService.obtenerNombreUsuario();

    if (matchId && playerId) {
      this.store.dispatch(MatchSocketActions.joinMatch({ matchId, playerId }));
    } else {
      this.router.navigate(['/inicio']);
      return;
    }

    this.setupTerritoryClickHandler();
    this.setupCombatSummaryListener();
    this.setupWinnerListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**


  /**
   * Central handler that reacts to territory selections from the map canvas.
   * Routes to the appropriate dialog based on current phase and context.
   */
  private setupTerritoryClickHandler(): void {
    const sub = this.store.select(selectSelectedTerritoryId).pipe(
      filter((id): id is string => id !== null),
      withLatestFrom(
        this.store.select(selectPhase),
        this.store.select(selectTerritories),
        this.store.select(selectArmies),
        this.store.select(selectLocalPlayer),
        this.store.select(selectHighlightedTerritoryIds),
        this.store.select(selectSelectedArmyId),
        this.store.select(selectPlayers),
      ),
    ).subscribe(([territoryId, phase, territories, armies, localPlayer, highlightedIds, selectedArmyId, players]) => {
      console.log('[Match] Territory clicked:', territoryId, '| Fase:', phase, '| LocalPlayer:', localPlayer?.id ?? 'NULL');
      if (!localPlayer) {
        console.warn('[Match] No localPlayer disponible — el joinMatch no se ha completado aún');
        return;
      }

      const territory = territories.find(t => t.id === territoryId);
      if (!territory) return;



      switch (phase) {
        case 'CONSTRUCCION':
          this.handleConstruccionClick(territory, localPlayer);
          break;
        case 'RECLUTAMIENTO':
          this.handleReclutamientoClick(territory, localPlayer, armies);
          break;
        case 'MOVIMIENTO':
          this.handleMovimientoClick(
            territory, localPlayer, localPlayer.id, armies,
            territories, highlightedIds, selectedArmyId, players,
          );
          break;
      }
    });

    this.subscriptions.push(sub);
  }

  // ── CONSTRUCCION PHASE ──

  private handleConstruccionClick(territory: Territory, player: Player): void {
    // Only allow building on own territories
    if (territory.ownerId !== player.id) {
      this.store.dispatch(MapActions.clearSelection());
      return;
    }

    const dialogRef = this.dialog.open(BuildDialog, {
      data: { territory, player },
      panelClass: 'military-dialog',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: BuildDialogResult | undefined) => {
      if (!result || result.action === 'cancel') {
        this.store.dispatch(MapActions.clearSelection());
        return;
      }

      const matchId = this.route.snapshot.paramMap.get('id')!;
      const playerId = this.authService.obtenerNombreUsuario()!;

      if (result.action === 'build' && result.buildingType && result.cost !== undefined) {
        this.store.dispatch(MatchSocketActions.syncAction({
          action: 'build',
          data: {
            matchId,
            playerId,
            territoryId: territory.id,
            buildingType: result.buildingType,
          }
        }));
      } else if (result.action === 'destroy') {
        this.store.dispatch(MatchSocketActions.syncAction({
          action: 'destroyBuilding',
          data: {
            matchId,
            playerId,
            territoryId: territory.id,
          }
        }));
      }

      this.store.dispatch(MapActions.clearSelection());
    });
  }

  // ── RECLUTAMIENTO PHASE ──

  private handleReclutamientoClick(territory: Territory, player: Player, armies: Army[]): void {
    // Only allow recruiting at own supreme base
    if (territory.ownerId !== player.id || !territory.hasSupremeBase) {
      this.store.dispatch(MapActions.clearSelection());
      return;
    }

    const dialogRef = this.dialog.open(RecruitDialog, {
      data: { player, territoryLabel: territory.label },
      panelClass: 'military-dialog',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result: RecruitDialogResult | undefined) => {
      if (!result || result.action === 'cancel') {
        this.store.dispatch(MapActions.clearSelection());
        return;
      }

      const matchId = this.route.snapshot.paramMap.get('id')!;
      const playerId = this.authService.obtenerNombreUsuario()!;

      if (result.action === 'recruit' && result.troopSize) {
        this.store.dispatch(MatchSocketActions.syncAction({
          action: 'recruit',
          data: {
            matchId,
            playerId,
            territoryId: territory.id,
            troopSize: result.troopSize,
          }
        }));
      }

      this.store.dispatch(MapActions.clearSelection());
    });
  }

  // ── MOVIMIENTO PHASE ──

  private handleMovimientoClick(
    territory: Territory,
    currentPlayer: Player,
    currentPlayerId: string,
    armies: Army[],
    territories: Territory[],
    highlightedIds: string[],
    selectedArmyId: string | null,
    players: Player[],
  ): void {
    // If we have a selected army and clicked a highlighted (adjacent) territory
    if (selectedArmyId && highlightedIds.includes(territory.id)) {
      const movingArmy = armies.find(a => a.id === selectedArmyId);
      if (!movingArmy) return;

      // Check if there's an enemy army in the target territory
      const enemyArmy = armies.find(a => a.territoryId === territory.id && a.ownerId !== currentPlayerId);

      if (enemyArmy) {
        // ── BATTLE ──
        const defenderPlayer = players.find(p => p.id === enemyArmy.ownerId);
        if (!defenderPlayer) return;

        const dialogRef = this.dialog.open(BattleDialog, {
          data: {
            attackerArmy: movingArmy,
            defenderArmy: enemyArmy,
            attackerPlayer: currentPlayer,
            defenderPlayer,
            territoryLabel: territory.label,
            mode: 'confirm',
          },
          panelClass: 'military-dialog',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result: BattleDialogResult | undefined) => {
          if (!result) return;

          if (result.action === 'fight') {
            const matchId = this.route.snapshot.paramMap.get('id')!;
            const playerId = this.authService.obtenerNombreUsuario()!;

            this.store.dispatch(MatchSocketActions.syncAction({
              action: 'queueMove',
              data: {
                matchId,
                playerId,
                armyId: selectedArmyId,
                toTerritoryId: territory.id,
              }
            }));
          }
          this.store.dispatch(MapActions.clearSelection());
        });
        return;
      }

      // Check if enemy owns the territory (city) but no army present
      if (territory.ownerId && territory.ownerId !== currentPlayerId && territory.buildingType) {
        // ── CITY CONQUEST ── (misma lógica que Backend gameEngine: MURO +10, TORRE +15, base +10, gen 2/3)
        const defenseStrength = this.calculateSiegeDefenseStrength(territory, players);
        const successChance = this.calculateSiegeSuccessChance(
          movingArmy.troopSize,
          defenseStrength,
          currentPlayer,
        );

        const dialogRef = this.dialog.open(CityDialog, {
          data: {
            army: movingArmy,
            territory,
            defenseStrength,
            successChance,
            mode: 'confirm'
          },
          panelClass: 'military-dialog',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result: CityDialogResult | undefined) => {
          if (!result) return;

          if (result.action === 'conquest') {
            const matchId = this.route.snapshot.paramMap.get('id')!;
            const playerId = this.authService.obtenerNombreUsuario()!;

            this.store.dispatch(MatchSocketActions.syncAction({
              action: 'queueMove',
              data: {
                matchId,
                playerId,
                armyId: movingArmy.id,
                toTerritoryId: territory.id,
              }
            }));
          }
          this.store.dispatch(MapActions.clearSelection());
        });
        return;
      }

      // ── Normal move ──
      const matchId = this.route.snapshot.paramMap.get('id')!;
      const playerId = this.authService.obtenerNombreUsuario()!;

      this.store.dispatch(MatchSocketActions.syncAction({
        action: 'queueMove',
        data: {
          matchId,
          playerId,
          armyId: selectedArmyId,
          toTerritoryId: territory.id,
        }
      }));
      return;
    }

    // If clicked on own army — handled by map component (selectArmy)
    // Just clear if clicking elsewhere
    if (!territory.occupiedByArmyId || armies.find(a => a.id === territory.occupiedByArmyId)?.ownerId !== currentPlayerId) {
      this.store.dispatch(MapActions.clearSelection());
    }
  }

  /** Alineado con `gameEngine.js` asalto a ciudad (defenseStrength, tope 95). */
  private calculateSiegeDefenseStrength(territory: Territory, players: Player[]): number {
    let defense = 30;
    if (territory.buildingType === 'MURO') defense += 10;
    if (territory.buildingType === 'TORRE') defense += 15;
    if (territory.hasSupremeBase) defense += 10;
    const owner = territory.ownerId ? players.find((p) => p.id === territory.ownerId) : undefined;
    if (owner?.matchGeneralId === 2) defense += 10;
    return Math.min(defense, 95);
  }

  /** Alineado con `gameEngine.js`: baseChance = tropas*5 - defensa*0.5 + (general 3 ? 10 : 0). */
  private calculateSiegeSuccessChance(
    troopSize: number,
    defenseStrength: number,
    attacker: Player | undefined,
  ): number {
    const atkGen = attacker?.matchGeneralId === 3 ? 10 : 0;
    const baseChance = troopSize * 5 - defenseStrength * 0.5 + atkGen;
    return Math.max(5, Math.min(95, Math.round(baseChance)));
  }

  private setupCombatSummaryListener(): void {
    const sub = this.socketService.listenForGame('COMBAT_SUMMARY').pipe(
      withLatestFrom(
        this.store.select(selectLocalPlayer),
        this.store.select(selectPlayers),
        this.store.select(selectArmies),
        this.store.select(selectTerritories),
      )
    ).subscribe(([results, localPlayer, players, armies, territories]) => {
      if (!localPlayer || !results) return;

      // Find results where the local player was involved
      const myResult = results.find((r: any) => r.attackerId === localPlayer.id || r.defenderId === localPlayer.id);

      if (myResult) {
        const attackerPlayer = players.find(p => p.id === myResult.attackerId);
        const defenderPlayer = players.find(p => p.id === myResult.defenderId);
        const territory = territories.find(t => t.id === myResult.territoryId);

        // We need the *original* army data for the dialog. 
        // Note: The armies in the store might have already updated to the new state.
        // We'll use dummy army objects for the display if needed, or rely on sizes from result.

        if (myResult.type === 'conquest') {
          // No longer showing modal for city conquest result
        } else {
          this.dialog.open(BattleDialog, {
            data: {
              attackerArmy: { troopSize: myResult.initialAttackerSize } as Army,
              defenderArmy: { troopSize: myResult.initialDefenderSize } as Army,
              attackerPlayer: attackerPlayer!,
              defenderPlayer: defenderPlayer!,
              territoryLabel: myResult.territoryLabel,
              mode: 'result',
              result: myResult
            },
            panelClass: 'military-dialog',
            disableClose: false
          });
        }
      }
    });

    this.subscriptions.push(sub);
  }

  private setupWinnerListener(): void {
    const sub = this.store.select(selectIsFinished).pipe(
      startWith(false),
      pairwise(),
      filter(([previous, current]) => !previous && current),
      withLatestFrom(
        this.store.select(selectWinnerId),
        this.store.select(selectPlayers),
        this.store.select(selectLocalPlayer)
      )
    ).subscribe(([_, winnerId, players, localPlayer]) => {
      if (this.winnerModalShown || !winnerId || !localPlayer) return;
      this.winnerModalShown = true;

      const winnerPlayer = players.find(p => p.id === winnerId);
      this.dialog.open(WinnerDialog, {
        data: {
          winnerName: winnerPlayer?.name ?? winnerId,
          isLocalWinner: localPlayer.id === winnerId
        },
        panelClass: 'military-dialog',
        disableClose: true
      });
    });

    this.subscriptions.push(sub);
  }
}

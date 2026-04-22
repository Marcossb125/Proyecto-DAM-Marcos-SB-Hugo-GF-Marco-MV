/* ═══════════════════════════════════════════════════════════════
   MATCH COMPONENT — Main Game Container
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { filter, take, withLatestFrom } from 'rxjs/operators';

import { MapComponent } from './map/map';
import { HudComponent } from './hud/hud';

import {
  MapActions,
  BuildingActions,
  ArmyActions,
  CombatActions,
  CityActions,
} from './store/match.actions';
import {
  selectPhase,
  selectSelectedTerritoryId,
  selectSelectedArmyId,
  selectTerritories,
  selectArmies,
  selectCurrentPlayer,
  selectCurrentPlayerId,
  selectHighlightedTerritoryIds,
  selectPlayers,
} from './store/match.selectors';
import { Territory, Army, Player } from './store/match.state';

import { BuildDialog, BuildDialogResult } from './dialogs/build-dialog';
import { RecruitDialog, RecruitDialogResult } from './dialogs/recruit-dialog';
import { BattleDialog, BattleDialogResult } from './dialogs/battle-dialog';
import { CityDialog, CityDialogResult } from './dialogs/city-dialog';

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
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.setupTerritoryClickHandler();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

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
        this.store.select(selectCurrentPlayer),
        this.store.select(selectCurrentPlayerId),
        this.store.select(selectHighlightedTerritoryIds),
        this.store.select(selectSelectedArmyId),
        this.store.select(selectPlayers),
      ),
    ).subscribe(([territoryId, phase, territories, armies, currentPlayer, currentPlayerId, highlightedIds, selectedArmyId, players]) => {
      if (!currentPlayer) return;

      const territory = territories.find(t => t.id === territoryId);
      if (!territory) return;

      switch (phase) {
        case 'CONSTRUCCION':
          this.handleConstruccionClick(territory, currentPlayer);
          break;
        case 'RECLUTAMIENTO':
          this.handleReclutamientoClick(territory, currentPlayer);
          break;
        case 'MOVIMIENTO':
          this.handleMovimientoClick(
            territory, currentPlayer, currentPlayerId, armies,
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

      if (result.action === 'build' && result.buildingType && result.cost !== undefined) {
        this.store.dispatch(BuildingActions.buildOnTerritory({
          territoryId: territory.id,
          buildingType: result.buildingType,
          cost: result.cost,
        }));
      } else if (result.action === 'destroy') {
        this.store.dispatch(BuildingActions.destroyBuilding({
          territoryId: territory.id,
        }));
      }

      this.store.dispatch(MapActions.clearSelection());
    });
  }

  // ── RECLUTAMIENTO PHASE ──

  private handleReclutamientoClick(territory: Territory, player: Player): void {
    // Only allow recruiting at own supreme base
    if (territory.ownerId !== player.id || !territory.hasSupremeBase) {
      this.store.dispatch(MapActions.clearSelection());
      return;
    }

    // Check if base already has an army
    if (territory.occupiedByArmyId) {
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

      if (result.action === 'recruit' && result.troopSize && result.creditsCost !== undefined && result.manpowerCost !== undefined) {
        this.store.dispatch(ArmyActions.createArmy({
          territoryId: territory.id,
          troopSize: result.troopSize,
          creditsCost: result.creditsCost,
          manpowerCost: result.manpowerCost,
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
          },
          panelClass: 'military-dialog',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result: BattleDialogResult | undefined) => {
          if (!result) return;

          if (result.action === 'fight' && result.winnerArmyId && result.loserArmyId) {
            this.store.dispatch(CombatActions.resolveBattle({
              winnerArmyId: result.winnerArmyId,
              loserArmyId: result.loserArmyId,
              territoryId: territory.id,
            }));
          } else if (result.action === 'retreat') {
            this.store.dispatch(CombatActions.retreat({
              armyId: movingArmy.id,
              fromTerritoryId: territory.id,
            }));
          }
        });
        return;
      }

      // Check if enemy owns the territory (city) but no army present
      if (territory.ownerId && territory.ownerId !== currentPlayerId && territory.buildingType) {
        // ── CITY CONQUEST ──
        const defenseStrength = this.calculateCityDefense(territory);
        const successChance = this.calculateSuccessChance(movingArmy.troopSize, defenseStrength);

        const dialogRef = this.dialog.open(CityDialog, {
          data: {
            army: movingArmy,
            territory,
            defenseStrength,
            successChance,
          },
          panelClass: 'military-dialog',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result: CityDialogResult | undefined) => {
          if (!result) return;

          if (result.action === 'conquest') {
            this.store.dispatch(CityActions.conquestCity({
              armyId: movingArmy.id,
              territoryId: territory.id,
              success: result.success ?? false,
            }));
          } else if (result.action === 'retreat') {
            this.store.dispatch(CombatActions.retreat({
              armyId: movingArmy.id,
              fromTerritoryId: territory.id,
            }));
          }
          // 'ignore' — just clear selection
          this.store.dispatch(MapActions.clearSelection());
        });
        return;
      }

      // ── Normal move ──
      this.store.dispatch(ArmyActions.moveArmy({
        armyId: selectedArmyId,
        toTerritoryId: territory.id,
      }));
      return;
    }

    // If clicked on own army — handled by map component (selectArmy)
    // Just clear if clicking elsewhere
    if (!territory.occupiedByArmyId || armies.find(a => a.id === territory.occupiedByArmyId)?.ownerId !== currentPlayerId) {
      this.store.dispatch(MapActions.clearSelection());
    }
  }

  private calculateCityDefense(territory: Territory): number {
    let defense = 30; // Base defense
    if (territory.buildingType === 'MURO') defense += 30;
    if (territory.buildingType === 'TORRE') defense += 20;
    if (territory.hasSupremeBase) defense += 20;
    return Math.min(defense, 95);
  }

  private calculateSuccessChance(troopSize: number, defenseStrength: number): number {
    // More troops = higher chance, stronger defense = lower chance
    const baseChance = (troopSize * 5) - (defenseStrength * 0.5);
    return Math.max(5, Math.min(95, Math.round(baseChance)));
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }
}

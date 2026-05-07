/* ═══════════════════════════════════════════════════════════════
   HUD COMPONENT — Game UI Overlay (Responsive)
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PhaseActions, MapActions } from '../store/match.actions';
import {
  selectPhase,
  selectCurrentPlayer,
  selectLocalPlayer,
  selectIsLocalTurn,
  selectCurrentTurn,
  selectPlayers,
  selectPlayerTerritories,
} from '../store/match.selectors';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './hud.html',
  styleUrl: './hud.css',
})
export class HudComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  phase$ = this.store.select(selectPhase);
  currentPlayer$ = this.store.select(selectCurrentPlayer);
  localPlayer$ = this.store.select(selectLocalPlayer);
  isLocalTurn$ = this.store.select(selectIsLocalTurn);
  currentTurn$ = this.store.select(selectCurrentTurn);
  players$ = this.store.select(selectPlayers);
  playerTerritories$ = this.store.select(selectPlayerTerritories);

  /** Whether the resource panel is collapsed (mobile mode) */
  isResourcesCollapsed = false;

  /** Whether the players list is collapsed */
  isPlayersCollapsed = true;

  /** Whether the game log sidebar is open */
  isLogOpen = false;

  /** Mock logs for demonstration */
  mockLogs = [
    { time: '10:00', message: 'Partida iniciada', type: 'system' },
    { time: '10:05', message: 'Commander Alpha ha capturado REFINERÍA', type: 'action' },
    { time: '10:10', message: 'Baron Delta ha reclutado 5 tropas', type: 'info' },
    { time: '10:15', message: 'Combate en Zona Cero: Alpha vs Delta', type: 'combat' },
    { time: '10:20', message: 'Alpha ha ganado el combate', type: 'result' },
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    // Auto-collapse on small screens
    if (typeof window !== 'undefined') {
      this.isResourcesCollapsed = window.innerWidth < 768;
    }
  }

  toggleResources(): void {
    this.isResourcesCollapsed = !this.isResourcesCollapsed;
  }

  toggleLog(): void {
    this.isLogOpen = !this.isLogOpen;
  }

  togglePlayers(): void {
    this.isPlayersCollapsed = !this.isPlayersCollapsed;
  }

  getPhaseLabel(phase: string): string {
    const labels: Record<string, string> = {
      RECAUDACION: 'RECAUDACIÓN',
      CONSTRUCCION: 'CONSTRUCCIÓN',
      RECLUTAMIENTO: 'RECLUTAMIENTO',
      MOVIMIENTO: 'MOVIMIENTO',
    };
    return labels[phase] ?? phase;
  }

  getPhaseDescription(phase: string): string {
    const descs: Record<string, string> = {
      RECAUDACION: 'Recaudando recursos...',
      CONSTRUCCION: 'Haz clic en un territorio propio para construir',
      RECLUTAMIENTO: 'Haz clic en tu base suprema para reclutar',
      MOVIMIENTO: 'Selecciona un ejército para moverlo',
    };
    return descs[phase] ?? '';
  }

  getPhaseIcon(phase: string): string {
    const icons: Record<string, string> = {
      RECAUDACION: 'payments',
      CONSTRUCCION: 'construction',
      RECLUTAMIENTO: 'military_tech',
      MOVIMIENTO: 'moving',
    };
    return icons[phase] ?? 'help';
  }

  getPhaseNumber(phase: string): number {
    const nums: Record<string, number> = {
      RECAUDACION: 1,
      CONSTRUCCION: 2,
      RECLUTAMIENTO: 3,
      MOVIMIENTO: 4,
    };
    return nums[phase] ?? 0;
  }

  getButtonLabel(phase: string): string {
    return phase === 'RECAUDACION' ? 'CONTINUAR' : 'LISTO';
  }

  onPhaseAction(phase: string): void {
    switch (phase) {
      case 'RECAUDACION':
        this.store.dispatch(PhaseActions.continueFromRecaudacion());
        break;
      case 'CONSTRUCCION':
        this.store.dispatch(PhaseActions.finishConstruccion());
        break;
      case 'RECLUTAMIENTO':
        this.store.dispatch(PhaseActions.finishReclutamiento());
        break;
      case 'MOVIMIENTO':
        this.store.dispatch(PhaseActions.finishMovimiento());
        break;
    }
  }

  onBackToInicio(): void {
    this.router.navigate(['/inicio']);
  }

  getFactionIcon(faction: string): string {
    const icons: Record<string, string> = {
      Warlord: '⚔',
      Trader: '💰',
      Chief: '👑',
      Scout: '🔭',
    };
    return icons[faction] ?? '?';
  }
}

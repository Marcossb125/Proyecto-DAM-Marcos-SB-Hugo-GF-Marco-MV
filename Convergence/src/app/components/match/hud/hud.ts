/* ═══════════════════════════════════════════════════════════════
   HUD COMPONENT — Game UI Overlay
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
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
export class HudComponent {
  private readonly store = inject(Store);

  phase$ = this.store.select(selectPhase);
  currentPlayer$ = this.store.select(selectCurrentPlayer);
  localPlayer$ = this.store.select(selectLocalPlayer);
  isLocalTurn$ = this.store.select(selectIsLocalTurn);
  currentTurn$ = this.store.select(selectCurrentTurn);
  players$ = this.store.select(selectPlayers);
  playerTerritories$ = this.store.select(selectPlayerTerritories);

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
    // Navigation handled by parent
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

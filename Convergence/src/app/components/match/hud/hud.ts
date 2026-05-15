/* ═══════════════════════════════════════════════════════════════
   HUD COMPONENT — Game UI Overlay (Responsive)
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { HudResourcesComponent } from './resources/hud-resources.component';
import { HudLogComponent } from './log/hud-log.component';
import { HudTopBarComponent } from './top-bar/hud-top-bar.component';
import { HudBottomBarComponent } from './bottom-bar/hud-bottom-bar.component';
import { RecaudacionDialogComponent, RecaudacionDialogData } from '../dialogs/recaudacion/recaudacion-dialog.component';
import { PhaseActions, MapActions, MatchSocketActions } from '../store/match.actions';
import {
  selectPhase,
  selectCurrentPlayer,
  selectLocalPlayer,
  selectIsLocalTurn,
  selectCurrentTurn,
  selectPlayers,
  selectPlayerTerritories,
} from '../store/match.selectors';
import { SocketService } from '../../../servicios/socket.service';
import { AuthService } from '../../../servicios/auth.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, HudResourcesComponent, HudLogComponent, HudTopBarComponent, HudBottomBarComponent],
  templateUrl: './hud.html',
  styleUrl: './hud.css',
})
export class HudComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly socketService = inject(SocketService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private socketSub?: Subscription;

  phase$ = this.store.select(selectPhase).pipe(tap(() => this.cdr.markForCheck()));
  currentPlayer$ = this.store.select(selectCurrentPlayer).pipe(tap(() => this.cdr.markForCheck()));
  localPlayer$ = this.store.select(selectLocalPlayer).pipe(tap(() => this.cdr.markForCheck()));
  isLocalTurn$ = this.store.select(selectIsLocalTurn).pipe(tap(() => this.cdr.markForCheck()));
  currentTurn$ = this.store.select(selectCurrentTurn).pipe(tap(() => this.cdr.markForCheck()));
  players$ = this.store.select(selectPlayers).pipe(tap(() => this.cdr.markForCheck()));
  playerTerritories$ = this.store.select(selectPlayerTerritories).pipe(tap(() => this.cdr.markForCheck()));

  /** Whether the resource panel is collapsed (mobile mode) */
  isResourcesCollapsed = false;

  /** Whether the players list is collapsed */
  isPlayersCollapsed = true;

  /** Whether the game log sidebar is open */
  isLogOpen = false;

  gameLogs: Array<{ time: string; message: string; type: string }> = [];

  // ── Recaudación Dialog ──
  private recaudacionSub?: import('rxjs').Subscription;

  ngOnInit(): void {
    this.checkScreenSize();
    this.socketSub = this.socketService.listen('GAME_LOG_ENTRY').subscribe(log => {
      this.gameLogs.push({
        time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: log.message,
        type: log.type
      });
      // Auto-scroll logic if needed could be added here
      setTimeout(() => this.scrollToBottom(), 50);
    });

    // Escuchar resumen de recaudación
    this.recaudacionSub = this.socketService.listen('RECAUDACION_SUMMARY').subscribe((data: any) => {
      const playerId = this.authService.obtenerNombreUsuario();
      const myEntry = data?.incomeSummary?.find((e: any) => e.playerId === playerId);

      this.dialog.open(RecaudacionDialogComponent, {
        width: 'auto',
        maxWidth: '96vw',
        panelClass: 'transparent-panel',
        disableClose: true,
        data: {
          round: data.round,
          myIncome: myEntry ?? null
        } as RecaudacionDialogData
      });

      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }
    if (this.recaudacionSub) {
      this.recaudacionSub.unsubscribe();
    }
  }

  private scrollToBottom(): void {
    const el = document.querySelector('.log-entries');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
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



  onPhaseAction(phase: string): void {
    const matchId = this.router.url.split('/').pop(); // Get ID from URL
    const playerId = this.authService.obtenerNombreUsuario();

    if (!matchId || !playerId) return;

    // In the real engine, all phase advances are 'playerReady'
    this.store.dispatch(MatchSocketActions.syncAction({
      action: 'playerReady',
      data: { matchId, playerId }
    }));
  }

  // (Removed closeRecaudacionDialog, since MatDialog handles it now)

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

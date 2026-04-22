/* ═══════════════════════════════════════════════════════════════
   COLLECTION DIALOG — Auto-Collection Phase Popup
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface CollectionDialogData {
  playerName: string;
  playerColor: string;
  creditBonus: number;
  manpowerBonus: number;
  refineryBonus: number;
  totalCredits: number;
  totalManpower: number;
}

@Component({
  selector: 'app-collection-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-line"></div>
        <h2 class="dialog-title">RECAUDACIÓN</h2>
        <div class="header-line"></div>
      </div>

      <div class="player-banner" [style.border-color]="data.playerColor">
        <mat-icon class="banner-icon">payments</mat-icon>
        <span class="banner-name" [style.color]="data.playerColor">{{ data.playerName }}</span>
      </div>

      <div class="collection-grid">
        <div class="collection-row">
          <span class="col-icon">💰</span>
          <span class="col-label">Créditos base</span>
          <span class="col-value">+{{ data.creditBonus }}</span>
        </div>
        <div class="collection-row refinery" *ngIf="data.refineryBonus > 0">
          <span class="col-icon">⛽</span>
          <span class="col-label">Bonus Refinería</span>
          <span class="col-value refinery-value">+{{ data.refineryBonus }}</span>
        </div>
        <div class="collection-row">
          <span class="col-icon">👥</span>
          <span class="col-label">Manpower</span>
          <span class="col-value">+{{ data.manpowerBonus }}</span>
        </div>
      </div>

      <div class="totals">
        <div class="total-row">
          <span>TOTAL CRÉDITOS</span>
          <span class="total-value">{{ data.totalCredits }}</span>
        </div>
        <div class="total-row">
          <span>TOTAL MANPOWER</span>
          <span class="total-value">{{ data.totalManpower }}</span>
        </div>
      </div>

      <div class="dialog-footer">
        <div class="timer-bar">
          <div class="timer-fill" [style.animation-duration]="'3s'"></div>
        </div>
        <button class="btn-ok" (click)="onClose()">
          <mat-icon>check</mat-icon>
          CONTINUAR
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: #0a0b0a;
      border: 1px solid #3a3d2e;
      border-radius: 4px;
      padding: 1.5rem;
      min-width: 340px;
      max-width: 420px;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .header-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, #4b5320);
    }
    .header-line:last-child {
      background: linear-gradient(90deg, #4b5320, transparent);
    }

    .dialog-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.65rem;
      color: #00ff41;
      letter-spacing: 3px;
      white-space: nowrap;
      text-shadow: 0 0 10px rgba(0, 255, 65, 0.4);
      margin: 0;
    }

    .player-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      background: rgba(75, 83, 32, 0.15);
      border: 1px solid #4b5320;
      border-left-width: 3px;
      border-radius: 3px;
      margin-bottom: 1.25rem;
    }

    .banner-icon {
      color: #00ff41;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .banner-name {
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .collection-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .collection-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.6rem;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(58, 61, 46, 0.5);
      border-radius: 3px;
      animation: slideIn 0.4s ease-out both;
    }

    .collection-row:nth-child(1) { animation-delay: 0.2s; }
    .collection-row:nth-child(2) { animation-delay: 0.4s; }
    .collection-row:nth-child(3) { animation-delay: 0.6s; }

    .collection-row.refinery {
      border-color: #ffd700;
      background: rgba(255, 215, 0, 0.08);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-15px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .col-icon { font-size: 1.1rem; }

    .col-label {
      flex: 1;
      font-size: 0.75rem;
      color: #828a5e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .col-value {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.55rem;
      color: #00ff41;
      text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
    }

    .refinery-value {
      color: #ffd700 !important;
      text-shadow: 0 0 8px rgba(255, 215, 0, 0.3) !important;
    }

    .totals {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.75rem;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      margin-bottom: 1rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.4rem;
      color: #828a5e;
      letter-spacing: 1px;
    }

    .total-value {
      font-size: 0.6rem;
      color: #fff;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
    }

    .dialog-footer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #3a3d2e;
    }

    .timer-bar {
      width: 100%;
      height: 3px;
      background: #3a3d2e;
      border-radius: 2px;
      overflow: hidden;
    }

    .timer-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff41, #4b5320);
      border-radius: 2px;
      animation: timerShrink 3s linear forwards;
    }

    @keyframes timerShrink {
      from { width: 100%; }
      to { width: 0%; }
    }

    .btn-ok {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.6rem 1.5rem;
      background: #4b5320;
      border: none;
      border-bottom: 3px solid #2d3314;
      border-radius: 3px;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }

    .btn-ok:hover {
      background: #5d6828;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
      transform: translateY(-1px);
    }

    .btn-ok mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `],
})
export class CollectionDialog implements OnInit, OnDestroy {
  readonly data: CollectionDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CollectionDialog>);
  private autoCloseTimer: any;

  ngOnInit(): void {
    // Auto-close after 3 seconds
    this.autoCloseTimer = setTimeout(() => {
      this.onClose();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  onClose(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    this.dialogRef.close();
  }
}

/* ═══════════════════════════════════════════════════════════════
   RECRUIT DIALOG — Recruitment Phase
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { Player, TROOP_COST } from '../store/match.state';

export interface RecruitDialogData {
  player: Player;
  territoryLabel: string;
}

export interface RecruitDialogResult {
  action: 'recruit' | 'cancel';
  troopSize?: number;
  creditsCost?: number;
  manpowerCost?: number;
}

@Component({
  selector: 'app-recruit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatSliderModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-line"></div>
        <h2 class="dialog-title">RECLUTAMIENTO</h2>
        <div class="header-line"></div>
      </div>

      <div class="base-info">
        <mat-icon class="base-icon">home</mat-icon>
        <div class="base-text">
          <span class="base-label">BASE SUPREMA</span>
          <span class="base-territory">{{ data.territoryLabel }}</span>
        </div>
      </div>

      <div class="recruit-controls">
        <div class="troop-display">
          <div class="troop-icon-group">
            <mat-icon>groups</mat-icon>
            <span class="troop-count">{{ troopCount() }}</span>
          </div>
          <span class="troop-label">TROPAS</span>
        </div>

        <div class="slider-row">
          <button class="btn-adjust" (click)="decrementTroops()" [disabled]="troopCount() <= 1">−</button>
          <mat-slider
            [min]="1"
            [max]="maxTroops()"
            [step]="1"
            discrete
            class="recruit-slider">
            <input matSliderThumb [ngModel]="troopCount()" (ngModelChange)="troopCount.set($event)">
          </mat-slider>
          <button class="btn-adjust" (click)="incrementTroops()" [disabled]="troopCount() >= maxTroops()">+</button>
        </div>

        <div class="cost-breakdown">
          <div class="cost-row">
            <span class="cost-label">Créditos:</span>
            <span class="cost-value" [class.insufficient]="creditsCost() > data.player.credits">
              💰 {{ creditsCost() }} / {{ data.player.credits }}
            </span>
          </div>
          <div class="cost-row">
            <span class="cost-label">Manpower:</span>
            <span class="cost-value" [class.insufficient]="manpowerCost() > data.player.manpower">
              👥 {{ manpowerCost() }} / {{ data.player.manpower }}
            </span>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-cancel" (click)="onCancel()">CANCELAR</button>
        <button
          class="btn-recruit"
          [disabled]="!canRecruit()"
          (click)="onRecruit()">
          <mat-icon>military_tech</mat-icon>
          RECLUTAR
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
      min-width: 360px;
      max-width: 440px;
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
    }

    .base-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(75, 83, 32, 0.15);
      border: 1px solid #4b5320;
      border-radius: 3px;
      margin-bottom: 1.25rem;
    }

    .base-icon {
      color: #00ff41;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .base-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .base-label {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      color: #00ff41;
      letter-spacing: 2px;
    }

    .base-territory {
      font-size: 0.85rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
    }

    .recruit-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .troop-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .troop-icon-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .troop-icon-group mat-icon {
      color: #00ff41;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .troop-count {
      font-family: 'Press Start 2P', monospace;
      font-size: 1.5rem;
      color: #00ff41;
      text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
    }

    .troop-label {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.4rem;
      color: #828a5e;
      letter-spacing: 3px;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-adjust {
      width: 32px;
      height: 32px;
      border: 1px solid #4b5320;
      border-radius: 3px;
      background: #141614;
      color: #00ff41;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-adjust:hover:not(:disabled) {
      border-color: #00ff41;
      box-shadow: 0 0 8px rgba(0, 255, 65, 0.2);
    }

    .btn-adjust:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .recruit-slider {
      flex: 1;
      --mdc-slider-handle-color: #00ff41;
      --mdc-slider-focus-handle-color: #00ff41;
      --mdc-slider-hover-handle-color: #00ff41;
      --mdc-slider-active-track-color: #4b5320;
      --mdc-slider-inactive-track-color: #3a3d2e;
    }

    .cost-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
    }

    .cost-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cost-label {
      font-size: 0.75rem;
      color: #828a5e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cost-value {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      color: #00ff41;
    }

    .cost-value.insufficient {
      color: #ff4444;
    }

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #3a3d2e;
    }

    .btn-cancel {
      padding: 0.5rem 1.25rem;
      background: transparent;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      color: #828a5e;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      border-color: #828a5e;
      color: #e0e0e0;
    }

    .btn-recruit {
      display: flex;
      align-items: center;
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
    }

    .btn-recruit:hover:not(:disabled) {
      background: #5d6828;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
      transform: translateY(-1px);
    }

    .btn-recruit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    .btn-recruit mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `],
})
export class RecruitDialog {
  readonly data: RecruitDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RecruitDialog>);

  troopCount = signal(1);

  maxTroops = computed(() => {
    const maxByCredits = Math.floor(this.data.player.credits / TROOP_COST.credits);
    const maxByManpower = Math.floor(this.data.player.manpower / TROOP_COST.manpower);
    return Math.max(1, Math.min(maxByCredits, maxByManpower, 50));
  });

  creditsCost = computed(() => this.troopCount() * TROOP_COST.credits);
  manpowerCost = computed(() => this.troopCount() * TROOP_COST.manpower);

  canRecruit = computed(() => {
    return this.creditsCost() <= this.data.player.credits &&
           this.manpowerCost() <= this.data.player.manpower &&
           this.troopCount() >= 1;
  });

  incrementTroops(): void {
    if (this.troopCount() < this.maxTroops()) {
      this.troopCount.update(v => v + 1);
    }
  }

  decrementTroops(): void {
    if (this.troopCount() > 1) {
      this.troopCount.update(v => v - 1);
    }
  }

  onRecruit(): void {
    this.dialogRef.close({
      action: 'recruit',
      troopSize: this.troopCount(),
      creditsCost: this.creditsCost(),
      manpowerCost: this.manpowerCost(),
    } as RecruitDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' } as RecruitDialogResult);
  }
}

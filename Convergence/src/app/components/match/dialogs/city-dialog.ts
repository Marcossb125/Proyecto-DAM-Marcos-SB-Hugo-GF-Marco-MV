/* ═══════════════════════════════════════════════════════════════
   CITY DIALOG — City Conquest
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Army, Territory } from '../store/match.state';

export interface CityDialogData {
  army: Army;
  territory: Territory;
  defenseStrength: number;
  successChance: number;
}

export interface CityDialogResult {
  action: 'conquest' | 'ignore' | 'retreat';
  success?: boolean;
}

@Component({
  selector: 'app-city-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-line"></div>
        <h2 class="dialog-title">🏛 CIUDAD</h2>
        <div class="header-line"></div>
      </div>

      @if (!conquestResolved()) {
        <div class="city-info">
          <div class="city-name">{{ data.territory.label }}</div>
          <div class="city-stats">
            <div class="stat-row">
              <span class="stat-label">Defensa</span>
              <div class="defense-bar">
                <div class="defense-fill" [style.width.%]="data.defenseStrength"></div>
              </div>
              <span class="stat-value">{{ data.defenseStrength }}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Éxito</span>
              <div class="success-bar">
                <div class="success-fill" [style.width.%]="data.successChance"
                     [class.high]="data.successChance >= 70"
                     [class.medium]="data.successChance >= 40 && data.successChance < 70"
                     [class.low]="data.successChance < 40"></div>
              </div>
              <span class="stat-value" [class.high]="data.successChance >= 70"
                    [class.medium]="data.successChance >= 40 && data.successChance < 70"
                    [class.low]="data.successChance < 40">
                {{ data.successChance }}%
              </span>
            </div>
          </div>

          <div class="troop-info">
            <mat-icon>groups</mat-icon>
            <span>Tus tropas: {{ data.army.troopSize }}</span>
          </div>
        </div>

        <div class="dialog-actions">
          <button class="btn-conquest" (click)="onConquest()">
            <mat-icon>flag</mat-icon>
            CONQUISTAR
          </button>
          <button class="btn-ignore" (click)="onIgnore()">
            IGNORAR
          </button>
          <button class="btn-retreat-city" (click)="onRetreat()">
            RETIRARSE
          </button>
        </div>
      } @else {
        <div class="conquest-result" [class.success]="conquestSuccess()" [class.failure]="!conquestSuccess()">
          <mat-icon class="result-icon">{{ conquestSuccess() ? 'flag' : 'close' }}</mat-icon>
          <div class="result-text">{{ conquestSuccess() ? '¡CONQUISTADA!' : 'FALLIDA' }}</div>
          <div class="result-details">
            {{ conquestSuccess() ? 'La ciudad es tuya' : 'Tu ejército ha sido destruido' }}
          </div>
          <button class="btn-continue-result" (click)="onClose()">CONTINUAR</button>
        </div>
      }
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

    .city-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .city-name {
      text-align: center;
      font-weight: 700;
      font-size: 1rem;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .city-stats {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .stat-label {
      width: 60px;
      font-size: 0.7rem;
      color: #828a5e;
      text-transform: uppercase;
    }

    .defense-bar, .success-bar {
      flex: 1;
      height: 8px;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 4px;
      overflow: hidden;
    }

    .defense-fill {
      height: 100%;
      background: linear-gradient(90deg, #c0392b, #ff4444);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .success-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .success-fill.high { background: linear-gradient(90deg, #2ecc71, #00ff41); }
    .success-fill.medium { background: linear-gradient(90deg, #f39c12, #ffaa00); }
    .success-fill.low { background: linear-gradient(90deg, #c0392b, #ff4444); }

    .stat-value {
      width: 40px;
      text-align: right;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
    }

    .stat-value.high { color: #00ff41; }
    .stat-value.medium { color: #ffaa00; }
    .stat-value.low { color: #ff4444; }

    .troop-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(75, 83, 32, 0.15);
      border: 1px solid #4b5320;
      border-radius: 3px;
      color: #00ff41;
      font-size: 0.8rem;
    }

    .troop-info mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .dialog-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-conquest {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.65rem;
      background: #4b5320;
      border: none;
      border-bottom: 3px solid #2d3314;
      border-radius: 3px;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-conquest:hover {
      background: #5d6828;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
    }

    .btn-conquest mat-icon { font-size: 16px; width: 16px; height: 16px; }

    .btn-ignore, .btn-retreat-city {
      flex: 1;
      padding: 0.65rem 0.5rem;
      background: transparent;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      color: #828a5e;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.35rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-ignore:hover, .btn-retreat-city:hover {
      border-color: #828a5e;
      color: #e0e0e0;
    }

    .conquest-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem;
      border-radius: 3px;
      animation: resultFlash 0.5s ease-out;
    }

    .conquest-result.success {
      background: rgba(0, 255, 65, 0.05);
      border: 1px solid #00ff41;
    }

    .conquest-result.failure {
      background: rgba(255, 68, 68, 0.05);
      border: 1px solid #ff4444;
    }

    .result-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .success .result-icon { color: #00ff41; filter: drop-shadow(0 0 15px rgba(0, 255, 65, 0.6)); }
    .failure .result-icon { color: #ff4444; filter: drop-shadow(0 0 15px rgba(255, 68, 68, 0.6)); }

    .result-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.9rem;
      letter-spacing: 3px;
    }

    .success .result-text { color: #00ff41; }
    .failure .result-text { color: #ff4444; }

    .result-details { font-size: 0.75rem; color: #828a5e; }

    .btn-continue-result {
      margin-top: 0.5rem;
      padding: 0.6rem 2rem;
      background: #4b5320;
      border: none;
      border-bottom: 3px solid #2d3314;
      border-radius: 3px;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-continue-result:hover {
      background: #5d6828;
    }

    @keyframes resultFlash {
      0% { opacity: 0; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { transform: scale(1); }
    }
  `],
})
export class CityDialog {
  readonly data: CityDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CityDialog>);

  conquestResolved = signal(false);
  conquestSuccess = signal(false);

  private resultData: CityDialogResult | null = null;

  onConquest(): void {
    const roll = Math.random() * 100;
    const success = roll <= this.data.successChance;
    this.conquestSuccess.set(success);
    this.resultData = { action: 'conquest', success };
    this.conquestResolved.set(true);
  }

  onIgnore(): void {
    this.dialogRef.close({ action: 'ignore' } as CityDialogResult);
  }

  onRetreat(): void {
    this.dialogRef.close({ action: 'retreat' } as CityDialogResult);
  }

  onClose(): void {
    this.dialogRef.close(this.resultData);
  }
}

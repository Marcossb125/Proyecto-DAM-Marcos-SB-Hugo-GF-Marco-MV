/* ═══════════════════════════════════════════════════════════════
   BUILD DIALOG — Construction Phase
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Territory, BuildingType, BUILDING_COSTS, Player } from '../store/match.state';

export interface BuildDialogData {
  territory: Territory;
  player: Player;
}

export interface BuildDialogResult {
  action: 'build' | 'destroy' | 'cancel';
  buildingType?: Exclude<BuildingType, null>;
  cost?: number;
}

@Component({
  selector: 'app-build-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-line"></div>
        <h2 class="dialog-title">CONSTRUCCIÓN</h2>
        <div class="header-line"></div>
      </div>

      <div class="territory-info">
        <span class="territory-label">{{ data.territory.label }}</span>
        <span class="territory-id">ID: {{ data.territory.id }}</span>
      </div>

      @if (data.territory.buildingType) {
        <div class="current-building">
          <div class="building-badge">
            <mat-icon>{{ getBuildingIcon(data.territory.buildingType) }}</mat-icon>
            <span>{{ data.territory.buildingType }}</span>
          </div>
          <button class="btn-destroy" (click)="onDestroy()">
            <mat-icon>delete</mat-icon>
            DESTRUIR
          </button>
        </div>
      } @else {
        <div class="building-list">
          <span class="list-label">EDIFICIOS DISPONIBLES</span>
          @for (building of availableBuildings; track building.type) {
            <button
              class="building-option"
              [class.disabled]="building.cost > data.player.credits"
              [disabled]="building.cost > data.player.credits"
              (click)="onBuild(building.type, building.cost)">
              <div class="building-info">
                <mat-icon>{{ building.icon }}</mat-icon>
                <div class="building-text">
                  <span class="building-name">{{ building.type }}</span>
                  <span class="building-desc">{{ building.description }}</span>
                </div>
              </div>
              <span class="building-cost" [class.insufficient]="building.cost > data.player.credits">
                💰 {{ building.cost }}
              </span>
            </button>
          }
        </div>
      }

      <div class="dialog-footer">
        <span class="player-credits">TUS CRÉDITOS: 💰 {{ data.player.credits }}</span>
        <button class="btn-cancel" (click)="onCancel()">CANCELAR</button>
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

    .territory-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      margin-bottom: 1rem;
    }

    .territory-label {
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      font-size: 0.9rem;
    }

    .territory-id {
      font-size: 0.7rem;
      color: #828a5e;
      font-family: 'Courier New', monospace;
    }

    .current-building {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(75, 83, 32, 0.15);
      border: 1px solid #4b5320;
      border-radius: 3px;
      margin-bottom: 1rem;
    }

    .building-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #00ff41;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.55rem;
    }

    .building-badge mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .btn-destroy {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: rgba(192, 57, 43, 0.2);
      border: 1px solid #c0392b;
      border-radius: 3px;
      color: #ff4444;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-destroy:hover {
      background: rgba(192, 57, 43, 0.4);
      box-shadow: 0 0 12px rgba(192, 57, 43, 0.3);
    }

    .btn-destroy mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .building-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .list-label {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.45rem;
      color: #828a5e;
      letter-spacing: 2px;
      margin-bottom: 0.25rem;
    }

    .building-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      color: #e0e0e0;
      cursor: pointer;
      transition: all 0.2s;
    }

    .building-option:hover:not(.disabled) {
      border-color: #00ff41;
      background: rgba(0, 255, 65, 0.05);
      box-shadow: 0 0 8px rgba(0, 255, 65, 0.1);
    }

    .building-option.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .building-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .building-info mat-icon {
      color: #00ff41;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .building-text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .building-name {
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .building-desc {
      font-size: 0.65rem;
      color: #828a5e;
    }

    .building-cost {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      color: #00ff41;
    }

    .building-cost.insufficient {
      color: #ff4444;
    }

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #3a3d2e;
    }

    .player-credits {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      color: #828a5e;
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
  `],
})
export class BuildDialog {
  readonly data: BuildDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<BuildDialog>);

  readonly availableBuildings = [
    { type: 'CUARTEL' as const, icon: 'military_tech', cost: BUILDING_COSTS.CUARTEL.credits, description: 'Mejora reclutamiento' },
    { type: 'FABRICA' as const, icon: 'factory', cost: BUILDING_COSTS.FABRICA.credits, description: 'Produce recursos extra' },
    { type: 'TORRE' as const, icon: 'cell_tower', cost: BUILDING_COSTS.TORRE.credits, description: 'Defensa del territorio' },
    { type: 'MURO' as const, icon: 'security', cost: BUILDING_COSTS.MURO.credits, description: 'Fortifica la posición' },
  ];

  getBuildingIcon(type: BuildingType): string {
    const map: Record<string, string> = {
      CUARTEL: 'military_tech',
      FABRICA: 'factory',
      TORRE: 'cell_tower',
      MURO: 'security',
    };
    return map[type ?? ''] ?? 'help';
  }

  onBuild(type: Exclude<BuildingType, null>, cost: number): void {
    this.dialogRef.close({ action: 'build', buildingType: type, cost } as BuildDialogResult);
  }

  onDestroy(): void {
    this.dialogRef.close({ action: 'destroy' } as BuildDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' } as BuildDialogResult);
  }
}

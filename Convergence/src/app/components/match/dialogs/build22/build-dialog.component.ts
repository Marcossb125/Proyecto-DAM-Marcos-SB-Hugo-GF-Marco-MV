/* ═══════════════════════════════════════════════════════════════
   BUILD DIALOG — Construction Phase
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Player, Territory, BuildingType, BUILDING_COSTS } from '../../store/match.state';

export interface BuildDialogData {
  player: Player;
  territory: Territory;
}

export interface BuildDialogResult {
  action: 'build' | 'destroy' | 'cancel';
  buildingType?: BuildingType;
  cost?: number;
}

@Component({
  selector: 'app-build-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './build-dialog.component.html',
  styleUrls: ['./build-dialog.component.css']
})
export class BuildDialog {
  readonly data: BuildDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<BuildDialog>);

  selectedBuilding = signal<BuildingType>(null);
  buildings = Object.entries(BUILDING_COSTS).map(([type, costs]) => ({
    type: type as BuildingType,
    name: this.getBuildingName(type as BuildingType),
    description: this.getBuildingDescription(type as BuildingType),
    icon: this.getBuildingIcon(type as BuildingType),
    credits: costs.credits,
    manpower: costs.manpower
  }));

  selectBuilding(type: BuildingType): void {
    if (this.canAfford(type)) {
      this.selectedBuilding.set(type);
    }
  }

  canAfford(type: BuildingType): boolean {
    if (!type) return false;
    const cost = BUILDING_COSTS[type as Exclude<BuildingType, null>];
    return this.data.player.credits >= cost.credits && this.data.player.manpower >= cost.manpower;
  }

  onBuild(): void {
    const type = this.selectedBuilding();
    if (type) {
      this.dialogRef.close({
        action: 'build',
        buildingType: type,
        cost: BUILDING_COSTS[type as Exclude<BuildingType, null>].credits
      } as BuildDialogResult);
    }
  }

  onDestroy(): void {
    this.dialogRef.close({ action: 'destroy' } as BuildDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' } as BuildDialogResult);
  }

  private getBuildingName(type: BuildingType): string {
    switch (type) {
      case 'CUARTEL': return 'Cuartel';
      case 'FABRICA': return 'Fábrica';
      case 'TORRE': return 'Torre de Defensa';
      case 'MURO': return 'Muro';
      default: return '';
    }
  }

  private getBuildingDescription(type: BuildingType): string {
    switch (type) {
      case 'CUARTEL': return 'Permite el reclutamiento de tropas en este territorio.';
      case 'FABRICA': return 'Aumenta la generación de créditos durante la fase de recaudación.';
      case 'TORRE': return 'Proporciona un aumento de 15 puntos en la defensa de tu territorio';
      case 'MURO': return 'Proporciona un aumento de 10 puntos en la defensa de tu territorio';
      default: return '';
    }
  }
  //holaaaaa

  private getBuildingIcon(type: BuildingType): string {
    switch (type) {
      case 'CUARTEL': return 'groups';
      case 'FABRICA': return 'factory';
      case 'TORRE': return 'fort';
      case 'MURO': return 'fence';
      default: return 'help';
    }
  }
}

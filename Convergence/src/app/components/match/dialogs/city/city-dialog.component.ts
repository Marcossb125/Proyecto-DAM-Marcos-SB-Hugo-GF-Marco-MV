/* ═══════════════════════════════════════════════════════════════
   CITY DIALOG — City Conquest
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Army, Territory } from '../../store/match.state';

export interface CityDialogData {
  army: Army;
  territory: Territory;
  defenseStrength: number;
  successChance: number;
  mode: 'confirm' | 'result';
  result?: {
    winnerId: string;
    finalAttackerSize: number;
    conquered: boolean;
    resultMessage: string;
  };
}

export interface CityDialogResult {
  action: 'conquest' | 'ignore' | 'retreat';
  success?: boolean;
}

@Component({
  selector: 'app-city-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './city-dialog.component.html',
  styleUrls: ['./city-dialog.component.css']
})
export class CityDialog {
  readonly data: CityDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CityDialog>);

  conquestSuccess(): boolean {
    if (this.data.mode === 'result') {
      return this.data.result?.conquered ?? false;
    }
    return false;
  }

  onConfirmConquest(): void {
    this.dialogRef.close({ action: 'conquest' } as CityDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'ignore' } as CityDialogResult);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

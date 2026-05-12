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
import { Player, TROOP_COST } from '../../store/match.state';

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
  templateUrl: './recruit-dialog.component.html',
  styleUrls: ['./recruit-dialog.component.css']
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

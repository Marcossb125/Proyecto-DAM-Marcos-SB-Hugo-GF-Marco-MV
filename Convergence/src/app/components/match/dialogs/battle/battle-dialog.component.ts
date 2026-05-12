/* ═══════════════════════════════════════════════════════════════
   BATTLE DIALOG — Combat Resolution
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Army, Player } from '../../store/match.state';

export interface BattleDialogData {
  attackerArmy: Army;
  defenderArmy: Army;
  attackerPlayer: Player;
  defenderPlayer: Player;
  territoryLabel: string;
  mode: 'confirm' | 'result';
  result?: {
    winnerId: string;
    finalAttackerSize: number;
    finalDefenderSize: number;
    conquered: boolean;
    resultMessage: string;
  };
}

export interface BattleDialogResult {
  action: 'fight' | 'retreat';
  winnerArmyId?: string;
  loserArmyId?: string;
}

@Component({
  selector: 'app-battle-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './battle-dialog.component.html',
  styleUrls: ['./battle-dialog.component.css']
})
export class BattleDialog {
  readonly data: BattleDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<BattleDialog>);

  isVictory(): boolean {
    if (this.data.mode === 'result') {
      return this.data.result?.winnerId === this.data.attackerPlayer.id;
    }
    return false;
  }

  calculateWinProb(): number {
    const atk = this.data.attackerArmy.troopSize;
    const def = this.data.defenderArmy.troopSize;
    const prob = (atk / (atk + def)) * 100;
    return Math.round(prob);
  }

  getProbColor(): string {
    const prob = this.calculateWinProb();
    if (prob >= 70) return '#00ff41';
    if (prob >= 40) return '#ffaa00';
    return '#ff4444';
  }

  onConfirmAttack(): void {
    this.dialogRef.close({ action: 'fight' } as BattleDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'retreat' } as BattleDialogResult);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

/* ═══════════════════════════════════════════════════════════════
   BATTLE DIALOG — Combat Resolution
   ═══════════════════════════════════════════════════════════════ */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Army, Player } from '../store/match.state';

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
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-line"></div>
        <h2 class="dialog-title">⚔ COMBATE ⚔</h2>
        <div class="header-line"></div>
      </div>

      <div class="battle-zone-label">{{ data.territoryLabel }}</div>

      @if (data.mode === 'confirm') {
        <div class="battle-matchup">
          <div class="combatant attacker">
            <div class="combatant-header">ATACANTE</div>
            <div class="combatant-name" [style.color]="data.attackerPlayer.color">
              {{ data.attackerPlayer.name }}
            </div>
            <div class="combatant-troops">
              <mat-icon>groups</mat-icon>
              <span class="troop-number">{{ data.attackerArmy.troopSize }}</span>
            </div>
            <div class="combatant-faction">{{ data.attackerPlayer.faction }}</div>
          </div>

          <div class="vs-divider">
            <div class="vs-line"></div>
            <span class="vs-text">VS</span>
            <div class="vs-line"></div>
          </div>

          <div class="combatant defender">
            <div class="combatant-header">DEFENSOR</div>
            <div class="combatant-name" [style.color]="data.defenderPlayer.color">
              {{ data.defenderPlayer.name }}
            </div>
            <div class="combatant-troops">
              <mat-icon>shield</mat-icon>
              <span class="troop-number">{{ data.defenderArmy.troopSize }}</span>
            </div>
            <div class="combatant-faction">{{ data.defenderPlayer.faction }}</div>
          </div>
        </div>

        <div class="win-probability">
            Probabilidad de éxito: <span [style.color]="getProbColor()">{{ calculateWinProb() }}%</span>
        </div>

        <div class="dialog-actions">
          <button class="btn-fight" (click)="onConfirmAttack()">
            <mat-icon>send</mat-icon>
            ORDENAR ATAQUE
          </button>
          <button class="btn-retreat" (click)="onCancel()">
            CANCELAR
          </button>
        </div>
      } @else {
        <div class="battle-result" [class.victory]="isVictory()" [class.defeat]="!isVictory()">
          <div class="result-icon">
            @if (isVictory()) {
              <mat-icon>emoji_events</mat-icon>
            } @else {
              <mat-icon>dangerous</mat-icon>
            }
          </div>
          <div class="result-text">{{ isVictory() ? '¡VICTORIA!' : 'DERROTA' }}</div>
          
          <div class="result-summary">
              <div class="summary-side">
                  <div class="side-label">Tus tropas</div>
                  <div class="side-value">{{ data.result?.finalAttackerSize }} / {{ data.attackerArmy.troopSize }}</div>
              </div>
              <div class="summary-side">
                  <div class="side-label">Enemigo</div>
                  <div class="side-value">{{ data.result?.finalDefenderSize }} / {{ data.defenderArmy.troopSize }}</div>
              </div>
          </div>

          <div class="result-details">
            {{ data.result?.resultMessage }}
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
      min-width: 400px;
      max-width: 480px;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .header-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, #c0392b);
    }

    .header-line:last-child {
      background: linear-gradient(90deg, #c0392b, transparent);
    }

    .dialog-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.65rem;
      color: #ff4444;
      letter-spacing: 3px;
      white-space: nowrap;
      text-shadow: 0 0 10px rgba(255, 68, 68, 0.4);
    }

    .battle-zone-label {
      text-align: center;
      font-size: 0.7rem;
      color: #828a5e;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1.25rem;
    }

    .battle-matchup {
      display: flex;
      align-items: stretch;
      gap: 0;
      margin-bottom: 1.5rem;
    }

    .combatant {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #141614;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
    }

    .combatant.attacker {
      border-color: #4b5320;
    }

    .combatant.defender {
      border-color: #c0392b;
    }

    .combatant-header {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.4rem;
      color: #828a5e;
      letter-spacing: 2px;
    }

    .combatant-name {
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      text-align: center;
    }

    .combatant-troops {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .combatant-troops mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #00ff41;
    }

    .troop-number {
      font-family: 'Press Start 2P', monospace;
      font-size: 1.2rem;
      color: #fff;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .combatant-faction {
      font-size: 0.65rem;
      color: #828a5e;
      font-style: italic;
    }

    .vs-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;
    }

    .vs-line {
      width: 1px;
      flex: 1;
      background: linear-gradient(180deg, transparent, #ff4444, transparent);
    }

    .vs-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.7rem;
      color: #ff4444;
      padding: 0.5rem 0;
      text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
    }

    .dialog-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-fight {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #4b5320;
      border: none;
      border-bottom: 3px solid #2d3314;
      border-radius: 3px;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-fight:hover {
      background: #5d6828;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
      transform: translateY(-1px);
    }

    .btn-fight mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-retreat {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: transparent;
      border: 1px solid #3a3d2e;
      border-radius: 3px;
      color: #828a5e;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-retreat:hover {
      border-color: #828a5e;
      color: #e0e0e0;
    }

    .btn-retreat mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .battle-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem;
      border-radius: 3px;
      animation: resultFlash 0.5s ease-out;
    }

    .battle-result.victory {
      background: rgba(0, 255, 65, 0.05);
      border: 1px solid #00ff41;
    }

    .battle-result.defeat {
      background: rgba(255, 68, 68, 0.05);
      border: 1px solid #ff4444;
    }

    .result-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .victory .result-icon mat-icon {
      color: #00ff41;
      filter: drop-shadow(0 0 15px rgba(0, 255, 65, 0.6));
    }

    .defeat .result-icon mat-icon {
      color: #ff4444;
      filter: drop-shadow(0 0 15px rgba(255, 68, 68, 0.6));
    }

    .result-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 1rem;
      letter-spacing: 3px;
    }

    .victory .result-text { color: #00ff41; text-shadow: 0 0 20px rgba(0, 255, 65, 0.5); }
    .defeat .result-text { color: #ff4444; text-shadow: 0 0 20px rgba(255, 68, 68, 0.5); }

    .result-details {
      font-size: 0.75rem;
      color: #828a5e;
      text-align: center;
    }

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
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
    }

    @keyframes resultFlash {
      0% { opacity: 0; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { transform: scale(1); }
    }

    .win-probability {
        text-align: center;
        margin-bottom: 1.5rem;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.5rem;
        color: #828a5e;
    }

    .win-probability span {
        font-size: 0.7rem;
    }

    .result-summary {
        display: flex;
        gap: 2rem;
        margin: 1rem 0;
    }

    .summary-side {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .side-label {
        font-size: 0.6rem;
        color: #828a5e;
        text-transform: uppercase;
        margin-bottom: 0.3rem;
    }

    .side-value {
        font-family: 'Press Start 2P', monospace;
        font-size: 0.6rem;
    }
  `],
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

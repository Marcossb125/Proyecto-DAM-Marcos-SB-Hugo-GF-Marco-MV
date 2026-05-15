import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hud-top-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './hud-top-bar.html',
  styleUrls: ['./hud-top-bar.css']
})
export class HudTopBarComponent {
  @Input() phase: string | null = null;
  @Input() currentTurn: number | null = null;
  @Input() isReady: boolean = false;
  
  @Output() phaseAction = new EventEmitter<string>();

  getPhaseLabel(phase: string | null): string {
    if (!phase) return '';
    const labels: Record<string, string> = {
      RECAUDACION: 'RECAUDACIÓN',
      CONSTRUCCION: 'CONSTRUCCIÓN',
      RECLUTAMIENTO: 'RECLUTAMIENTO',
      MOVIMIENTO: 'MOVIMIENTO',
    };
    return labels[phase] ?? phase;
  }

  getPhaseDescription(phase: string | null): string {
    if (!phase) return '';
    const descs: Record<string, string> = {
      RECAUDACION: 'Recaudando recursos...',
      CONSTRUCCION: 'Haz clic en un territorio propio para construir',
      RECLUTAMIENTO: 'Haz clic en tu base suprema para reclutar',
      MOVIMIENTO: 'Selecciona un ejército para moverlo',
    };
    return descs[phase] ?? '';
  }

  getPhaseNumber(phase: string | null): number {
    if (!phase) return 0;
    const nums: Record<string, number> = {
      RECAUDACION: 1,
      CONSTRUCCION: 2,
      RECLUTAMIENTO: 3,
      MOVIMIENTO: 4,
    };
    return nums[phase] ?? 0;
  }

  onPhaseAction(event: Event, phase: string | null): void {
    event.stopPropagation();
    if (phase) {
      this.phaseAction.emit(phase);
    }
  }
}

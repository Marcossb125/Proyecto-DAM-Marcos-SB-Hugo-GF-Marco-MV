import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hud-bottom-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './hud-bottom-bar.html',
  styleUrls: ['./hud-bottom-bar.css']
})
export class HudBottomBarComponent {
  @Output() abortMission = new EventEmitter<void>();

  onAbort(event: Event): void {
    event.stopPropagation();
    this.abortMission.emit();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Player } from '../../store/match.state';

@Component({
  selector: 'app-hud-resources',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './hud-resources.html',
  styleUrls: ['./hud-resources.css']
})
export class HudResourcesComponent {
  @Input() player: Player | null | undefined = null;
  @Input() isCollapsed = false;
  
  @Output() toggle = new EventEmitter<void>();

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggle.emit();
  }
}

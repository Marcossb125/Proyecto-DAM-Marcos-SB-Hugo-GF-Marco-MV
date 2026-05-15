import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface GameLogEntry {
  time: string;
  message: string;
  type: string;
}

@Component({
  selector: 'app-hud-log',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './hud-log.html',
  styleUrls: ['./hud-log.css']
})
export class HudLogComponent implements AfterViewChecked {
  @Input() gameLogs: GameLogEntry[] = [];
  @Input() isOpen = false;
  
  @Output() toggle = new EventEmitter<void>();

  @ViewChild('logContainer') private logContainer!: ElementRef;

  private shouldScroll = false;

  // We detect if new logs were added and scroll to bottom
  ngOnChanges() {
    this.shouldScroll = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggle.emit();
  }

  private scrollToBottom(): void {
    try {
      if (this.logContainer) {
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}

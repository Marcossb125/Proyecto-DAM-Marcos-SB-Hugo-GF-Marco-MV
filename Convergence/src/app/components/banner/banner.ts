import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class Banner {
  @Input() title: string = 'CONVERGENCE';
  @Input() subtitle: string = '';
  @Input() showEmblem: boolean = true;
}

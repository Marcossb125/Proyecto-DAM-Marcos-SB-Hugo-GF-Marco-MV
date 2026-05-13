import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-top-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './top-actions.html',
  styleUrl: './top-actions.css'
})
export class TopActions {
  
  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }
}

import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-top-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './top-actions.html',
  styleUrl: './top-actions.css'
})
export class TopActions {
  showNotifications = signal(false);
  
  notifications = signal([
    { id: 1, title: 'INFORME DE INTELIGENCIA', message: 'Movimiento detectado en el sector 7G.', time: 'Hace 5 min', type: 'alert' },
    { id: 2, title: 'NUEVA ORDEN', message: 'Desplegar tropas en la frontera norte.', time: 'Hace 15 min', type: 'info' },
    { id: 3, title: 'ESTADO DE SUMINISTROS', message: 'Combustible al 85%. Recarga necesaria en 48h.', time: 'Hace 1h', type: 'warning' }
  ]);
  
  constructor(private router: Router) {}

  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

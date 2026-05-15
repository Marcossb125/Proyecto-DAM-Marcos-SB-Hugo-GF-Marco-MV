import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SocketService } from '../../servicios/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-socket',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './test-socket.component.html',
  styleUrl: './test-socket.component.css'
})
export class TestSocket implements OnInit, OnDestroy {
  // Signal para almacenar el resultado y que la UI se actualice automáticamente
  public lastResponse = signal<any>(null);
  
  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // Escuchamos la respuesta del servidor
    // Usamos el 'authSocket' que es el que no requiere login para este ejemplo simple
    this.subscription.add(
      this.socketService.listen('TEST_RESPONSE').subscribe({
        next: (data) => {
          console.log('[TestSocket] Respuesta recibida:', data);
          this.lastResponse.set(data);
        },
        error: (err) => console.error('[TestSocket] Error escuchando socket:', err)
      })
    );
  }

  ngOnDestroy(): void {
    // Limpiamos la suscripción al destruir el componente
    this.subscription.unsubscribe();
  }

  enviarMensaje(): void {
    const data = {
      message: 'hola desde el frontend',
      timestamp: Date.now()
    };
    
    console.log('[TestSocket] Emitiendo TEST_EVENT:', data);
    
    // Emitimos el evento usando el socket de auth para este ejemplo
    this.socketService.emit('TEST_EVENT', data, true);
  }
}

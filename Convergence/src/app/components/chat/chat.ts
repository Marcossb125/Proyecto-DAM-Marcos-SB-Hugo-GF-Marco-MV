import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PartidaService } from '../../servicios/partida.service';

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isSelf: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements AfterViewChecked {
  private router = inject(Router);
  private partidaService = inject(PartidaService);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  newMessage = signal('');
  playerName = signal('Comandante');

  // Mock messages for initial load
  messages = signal<ChatMessage[]>([
    { id: 1, sender: 'General Kenobi', content: '¡Hola a todos! Comandante listo para el despliegue.', timestamp: new Date(Date.now() - 3600000), isSelf: false },
    { id: 2, sender: 'Dark Overlord', content: 'No te servirá de nada. La victoria será mía.', timestamp: new Date(Date.now() - 1800000), isSelf: false },
    { id: 3, sender: 'Tactical Mind', content: '¿Alguien para una partida rápida en Dark Crusade?', timestamp: new Date(Date.now() - 600000), isSelf: false },
  ]);

  constructor() {
    this.playerName.set(this.partidaService.obtenerNombreUsuario() || 'Comandante');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.newMessage().trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      sender: this.playerName(),
      content: this.newMessage(),
      timestamp: new Date(),
      isSelf: true
    };

    this.messages.update(msgs => [...msgs, message]);
    this.newMessage.set('');
    
    // TODO: Connect to backend socket service here
    console.log('Mensaje enviado al canal global:', message.content);
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

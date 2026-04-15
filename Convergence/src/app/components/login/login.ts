import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartidaService } from '../../servicios/partida.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private router: Router, private partidaService: PartidaService) { }

  onLogin(): void {
    this.errorMessage.set('');

    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);

    this.partidaService.obtenerUsuarios().forEach((usuario) => {
      if (usuario.username === this.username() && usuario.password === this.password()) {
        this.router.navigate(['/inicio']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos.');
        this.isLoading.set(false);
      }
    });
  }
}

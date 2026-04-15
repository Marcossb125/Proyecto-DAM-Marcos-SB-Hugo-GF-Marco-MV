import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartidaService } from '../../servicios/partida.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private router: Router, private partidaService: PartidaService) { }

  onRegister(): void {
    this.errorMessage.set('');

    if (!this.email() || !this.username() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    this.isLoading.set(true);

    // Simulate registration
    this.partidaService.guardarUsuario({
      email: this.email(),
      username: this.username(),
      password: this.password(),
    });
    this.router.navigate(['/login']);
  }
}

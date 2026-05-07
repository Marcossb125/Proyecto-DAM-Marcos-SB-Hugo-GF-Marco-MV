import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Banner } from '../banner/banner';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, Banner],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private router: Router, private authService: AuthService) { }

  onLogin(): void {

    this.errorMessage.set('');

    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);

    this.authService.loginUser({
      nickname: this.username(),
      password: this.password()
    }).then((response) => {
      console.log(response);
      if (response) {
        this.authService.guardarNombreUsuario(this.username());
        this.router.navigate(['/inicio']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos.');
        this.isLoading.set(false);
      }
    });
  }
}

import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  onLogin(): void {
    this.errorMessage.set('');

    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);

    // Simulate login delay
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/inicio']);
    }, 1200);
  }
}

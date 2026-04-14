import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

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
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/login']);
    }, 1500);
  }
}

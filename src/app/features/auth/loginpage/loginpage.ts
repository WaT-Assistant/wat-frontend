import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, LoginPayload } from '../../../core/services/auth';
import { LoginFormData } from '../models/auth';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './loginpage.html'
})
export class LoginPageComponent {
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  showPassword = false;
  errorMessage = '';

  // Form data model for login
  formData: LoginFormData = {
    email: '',
    password: ''
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';

    // Frontend validation
    if (!this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // Map frontend fields to match your .NET LoginDTO
    const payload: LoginPayload = {
      Email: this.formData.email,
      Password: this.formData.password
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid email address or password.';
        } else if (err.status === 400) {
          if (err.error && err.error.errors) {
            const firstErrorKey = Object.keys(err.error.errors)[0];
            this.errorMessage = err.error.errors[firstErrorKey][0];
          } else if (err.error && err.error.detail) {
            this.errorMessage = err.error.detail;
          } else {
            this.errorMessage = 'Invalid data provided.';
          }
        } else {
          this.errorMessage = 'Server error. Please try again later.';
        }

        this.cdr.detectChanges();
        console.error('Login failed:', err);
      }
    });
  }
}
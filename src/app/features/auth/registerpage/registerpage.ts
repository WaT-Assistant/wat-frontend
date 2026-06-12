import { Component, inject, ChangeDetectorRef} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Auth, RegisterPayload} from '../../../core/services/auth';
import { RegisterFormData } from '../models/auth';


@Component({
  selector: 'app-registerpage',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registerpage.html'
})
export class RegisterPageComponent {
  showPassword = false;
  errorMessage = '';
  private authService = inject(Auth);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  formData: RegisterFormData = {
    email: '',
    password: '',
    fullname:  ''
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.formData.fullname || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill in all the fields'; 
      return;
    }

    const payload: RegisterPayload = {
      FullName: this.formData.fullname,
      EmailAddress: this.formData.email,
      Password: this.formData.password
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);

        const loginPayload = {
          Email: this.formData.email,
          Password: this.formData.password
        };
        
        this.authService.login(loginPayload).subscribe({
          next: () => {
            // Redirect to dashboard or landing page
            this.router.navigate(['/']);
          },
          error: (loginErr) => {
            console.error('Auto-login failed:', loginErr);
            // Fallback: send them to login page if auto-login fails
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        if (err.status === 400) {
          if (err.error && err.error.errors) {
            const firstErrorKey = Object.keys(err.error.errors)[0];
            this.errorMessage = err.error.errors[firstErrorKey][0];
          } else if (err.error && err.error.detail) {
            this.errorMessage = err.error.detail;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Registration failed. Please check your data.';
          }
          console.error('Registration failed:', err.error);
        } else {
          this.errorMessage = 'Server error. Please try again later.';
          console.error('Registration failed:', err);
        }

        this.cdr.detectChanges();
      }
    });
  }
}
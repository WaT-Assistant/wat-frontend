import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, LoginPayload } from '../../../core/services/auth';
import { LoginFormData } from '../models/auth';
import {IconComponent} from '../../../shared/components/icons/icon.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [RouterLink, FormsModule, IconComponent],
  templateUrl: './loginpage.html'
})
export class LoginPageComponent {
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  showPassword = false;
  errorMessage = '';
  isLoading = false;

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
    
    this.isLoading = true;

    const payload: LoginPayload = {
      Email: this.formData.email,
      Password: this.formData.password
    };

    this.authService.login(payload)
    .pipe(finalize(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    }))
    .subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
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

        console.error('Login failed:', err);
      }
    });
  }
}
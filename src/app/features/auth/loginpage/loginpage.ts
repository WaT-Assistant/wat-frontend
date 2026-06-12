import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './loginpage.html'
})
export class LoginPageComponent {
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
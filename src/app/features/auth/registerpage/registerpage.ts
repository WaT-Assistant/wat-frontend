import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-registerpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registerpage.html'
})
export class RegisterPageComponent {
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
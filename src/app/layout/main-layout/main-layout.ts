import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { Auth } from '../../core/services/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, SidebarComponent, AsyncPipe, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  isSidebarOpen = false;
  isAuthPage = false;

  private authService = inject(Auth);
  private router = inject(Router);

  // Expose the observable to the HTML template
  isLoggedIn$ = this.authService.isLoggedIn$;

  
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url === '/login' || event.url === '/register';
      }
    });
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isAuthRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  onLogout() {
    this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/']);// Redirect to landing after logout
    },
    error: (err) => {
      console.error('Error on sign out', err);
    }
  }); 
  }
}

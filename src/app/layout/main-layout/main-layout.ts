import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { Auth } from '../../core/services/auth';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, SidebarComponent, AsyncPipe, RouterLink, IconComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  isSidebarOpen = false;
  isAuthPage = false;

  private authService = inject(Auth);
  private router = inject(Router);
  private logger = inject(LoggerService);

  // Expose the observable to the HTML template
  isLoggedIn$ = this.authService.isLoggedIn$;

  
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const cleanedUrl = event.urlAfterRedirects.split('?')[0].split('#')[0];
        this.isAuthPage = cleanedUrl === '/login' || cleanedUrl === '/register';
      }
    });
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout() {
    this.authService.logout().subscribe({
    next: () => {
      if(this.router.url.startsWith('/dashboard')) {
        this.router.navigate(['/']);// Redirect to landing after logout
      }
    },
    error: (err) => {
      this.logger.error('Error on sign out', err.message);
    }
  }); 
  }
}

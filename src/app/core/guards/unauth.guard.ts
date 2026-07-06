import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const unauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';

  if (!isLoggedIn) {
    return true; 
  }

  return router.createUrlTree(['/']);
};
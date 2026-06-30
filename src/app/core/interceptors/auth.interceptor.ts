import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Expired token');
        auth.clearAuthState();

        const currentUrl = router.routerState.snapshot.url;

        router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
      }
      
      return throwError(() => error);
    })
  );;
};
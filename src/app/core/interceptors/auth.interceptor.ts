import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { Auth } from '../services/auth';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);

  const authReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'X-CSRF': '1'
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/Auth/')) {
        console.warn('Access token expired, attempting to refresh...');

        return auth.refreshToken().pipe(
          switchMap(() => {
            return next(authReq);
          }),
          catchError((refreshError) => {
            console.error('Refresh token expired or invalid');
            auth.clearAuthState();

            const currentUrl = router.routerState.snapshot.url;
            router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
            
            return throwError(() => refreshError);
          })
        );
      }
      
      return throwError(() => error);
    })
  );;
};
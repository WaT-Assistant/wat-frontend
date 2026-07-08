import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { Auth } from '../services/auth';
import { LoggerService } from '../services/logger.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const logger = inject(LoggerService);
  const authReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'X-CSRF': '1'
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/Auth/')) {
        
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(false);

          logger.warn('Access token expired, attempting to refresh...');

          return auth.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshTokenSubject.next(true);
              return next(authReq); 
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              refreshTokenSubject.next(false);
              
              logger.error('Refresh token expired or invalid');
              auth.clearAuthState();

              const currentUrl = router.routerState.snapshot.url;
              router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
              
              return throwError(() => refreshError);
            })
          );
        } 
        else {
          return refreshTokenSubject.pipe(
            filter(tokenRefreshed => tokenRefreshed === true),
            take(1), 
            switchMap(() => {
              return next(authReq); 
            })
          );
        }
      }
      
      return throwError(() => error);
    })
  );
};
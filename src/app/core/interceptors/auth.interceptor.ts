import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) =>{
    const authService = inject(Auth);
    const router = inject(Router);

    const token = localStorage.getItem('token');

    let clonReq = req;
    if(token){
        clonReq = req.clone({
            setHeaders: {
                Authorization: 'Bearer ${token}'
            }
        });
    }

    return next(clonReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.status == 401){
                console.warn("Token expired or invalid. Logging out...");
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    )
}
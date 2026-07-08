import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../env/environment';

export interface RegisterPayload {
  FullName: string;
  EmailAddress: string;
  Password: string;
}

export interface LoginPayload {
  Email: string;
  Password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  
  private apiUrl =`${environment.apiUrl}/Auth`;

  private currentUserSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$ = this.currentUserSubject.asObservable();

  private isAuthenticated(): boolean{
    return localStorage.getItem("isLoggedIn") == 'true';
  }

  login(credentials: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials, {
      withCredentials: true
    })
    .pipe(
      tap(() => {
        localStorage.setItem('isLoggedIn', 'true');
        this.currentUserSubject.next(true);
      })
    );
  }

  register(userData: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Logout`, {}, {withCredentials: true})
    .pipe(
      tap(() => {
        this.clearAuthState();
      }) 
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Refresh`, {}, { withCredentials: true });
  }

  clearAuthState() {
    localStorage.removeItem('isLoggedIn');
    this.currentUserSubject.next(false);  // Notify app that user is logged out
  }
}

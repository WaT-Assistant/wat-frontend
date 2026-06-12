import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  
  private apiUrl = 'http://localhost:8080/api/Auth';

  private currentUserSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.currentUserSubject.asObservable();

  private hasToken(): boolean{
    return !!localStorage.getItem('token');
  }

  login(credentials: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        if(response && response.token){
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(true);
        }
      })
    )
  }

  register(userData: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(false); // Notify app that user is logged out
  }
}

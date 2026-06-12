import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  login(credentials: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials);
  }

  register(userData: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, userData);
  }
}

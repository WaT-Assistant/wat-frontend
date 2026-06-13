import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyOffer } from '../../features/dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private http = inject(HttpClient);
  
  // Replace with your actual .NET local port
  private apiUrl = 'http://localhost:8080/api/JobOffer'; 

  // Fetch user's job offers
  getUserOffers(): Observable<MyOffer[]> {
    return this.http.get<MyOffer[]>(`${this.apiUrl}`);
  }

}
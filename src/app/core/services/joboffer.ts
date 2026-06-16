import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyOffer } from '../../features/dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/JobOffer'; 

  getUserOffers(): Observable<MyOffer[]> {
    return this.http.get<MyOffer[]>(`${this.apiUrl}`);
  }

  createOffer(data: any): Observable<MyOffer> {
    return this.http.post<MyOffer>(this.apiUrl, data);
  }

  editOffer(offerId: string, data: any): Observable<MyOffer> {
    return this.http.put<MyOffer>(`${this.apiUrl}/${offerId}`, data);
  }
}
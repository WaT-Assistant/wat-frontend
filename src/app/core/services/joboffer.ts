import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyOffer } from '../../features/dashboard/dashboard';
import { PublicOffer } from '../../features/public-offers-page/public-offers-page';

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

  deleteOffer(offerId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${offerId}`);
  }
  getPublicOffers(page: number, pageSize: number = 10): Observable<PublicOffer[]> {
  const params = new HttpParams()
  .set('page', page)
  .set('pageSize', pageSize);
    return this.http.get<PublicOffer[]>(`${this.apiUrl}/published`, {params});
  }
}
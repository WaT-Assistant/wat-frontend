import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportantInfo, MyOffer } from '../../features/dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ImportantInfoService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/ImportantInfo'; 

  getImportantInfoByOfferId(offer_id: string): Observable<ImportantInfo> {
    return this.http.get<ImportantInfo>(`${this.apiUrl}/${offer_id}`);
  }
}
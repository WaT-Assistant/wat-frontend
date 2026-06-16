import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportantInfo } from '../../features/dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class ImportantInfoService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/api/ImportantInfo'; 

  createImportantInfo(offerId: string, payload: any): Observable<ImportantInfo> {
    return this.http.post<ImportantInfo>(`${this.apiUrl}/${offerId}`, payload);
  }

  editImportantInfo(offerId: string, data: any): Observable<ImportantInfo>{
    return this.http.put<ImportantInfo>(`${this.apiUrl}/${offerId}`, data);
  }

  getImportantInfoByOfferId(offer_id: string): Observable<ImportantInfo> {
    return this.http.get<ImportantInfo>(`${this.apiUrl}/${offer_id}`);
  }

  deleteImportantInfo(id: string) {
    return this.http.delete<ImportantInfo>(`${this.apiUrl}/${id}`);
  }
}
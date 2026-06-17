import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Note{
  id: string;
  text: string;
  colorHex: string;
  createdAt: string;
}

@Injectable({
    providedIn: 'root'
})

export class NoteService{
    http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/Note';

    getNoteById(id: string): Observable<Note>{
        return this.http.get<Note>(`${this.apiUrl}/${id}`);
    }

    getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(data: any): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, data);
  }

  updateNote(noteId: string, data: any): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${noteId}`, data);
  }

  deleteNote(noteId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${noteId}`);
  }
}
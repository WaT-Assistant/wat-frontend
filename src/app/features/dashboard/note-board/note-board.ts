import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { NoteComponent } from '../../../shared/components/note/note';
import { NoteService } from '../../../core/services/note';
import { Note } from '../../../core/services/note';

@Component({
  selector: 'app-note-board',
  imports: [CommonModule, ReactiveFormsModule, NoteComponent],  
  templateUrl: './note-board.html',
  styleUrl: './note-board.scss',
})
export class NoteBoard implements OnInit{
  private noteService = inject(NoteService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  noteForm!: FormGroup;
  
  availableColors = [
    '#FFFF88', // Classic Yellow
    '#B5EAD7', // Mint Green
    '#C7CEEA', // Light Blue
    '#FFDAC1', // Peach
    '#FFB7B2'  // Pastel Pink
  ];
  selectedColor = this.availableColors[0];

  // Reactive data stream
  private refreshNotes = new BehaviorSubject<void>(undefined);
  notes$ = this.refreshNotes.pipe(
    switchMap(() => this.noteService.getAllNotes()),
    tap(() => this.cdr.markForCheck())
  );

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.noteForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(300)]],
      colorHex: [this.selectedColor]
    });
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.noteForm.patchValue({ colorHex: color });
  }

  addNote() {
    if (this.noteForm.invalid) return;

    const payload = {
      text: this.noteForm.value.text.trim(),
      colorHex: this.noteForm.value.colorHex
    };
    this.noteService.createNote(payload).subscribe({
      next: () => {
        this.noteForm.reset({ text: '', colorHex: this.availableColors[0] });
        this.selectedColor = this.availableColors[0];
        
        // Refresh the board
        this.refreshNotes.next();
      },
      error: (err) => console.error('Error creating note:', err)
    });
  }

  deleteNote(id: string) {
    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.refreshNotes.next();
      },
      error: (err) => console.error('Error deleting note:', err)
    });
  }

  editNote(note: Note) {
    // Placeholder for future edit logic
    console.log('Edit clicked for note:', note.id);
  }
}

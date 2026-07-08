import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { NoteComponent } from './note/note';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { ViewNoteModalComponent } from './modals/view-note-modal/view-note-modal';
import { EditNoteModalComponent } from './modals/edit-note-modal/edit-note-modal';
import { NoteService } from '../../../core/services/note';
import { Note } from '../../../core/services/note';
import { IconComponent } from "../../../shared/components/icons/icon.component";
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-note-board',
  imports: [CommonModule, ReactiveFormsModule, NoteComponent, ConfirmationModalComponent, ViewNoteModalComponent, EditNoteModalComponent, IconComponent],  
  templateUrl: './note-board.html',
  styleUrl: './note-board.scss',
})
export class NoteBoard implements OnInit{
  @ViewChild(ConfirmationModalComponent) deleteModal!: ConfirmationModalComponent;
  
  private noteService = inject(NoteService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private logger = inject(LoggerService);

  noteIdToDelete = signal<string | null>(null);

  noteForm!: FormGroup;
  editForm!: FormGroup;
  
  availableColors = [
    '#FFFF88', // Classic Yellow
    '#B5EAD7', // Mint Green
    '#C7CEEA', // Light Blue
    '#FFDAC1', // Peach
    '#FFB7B2'  // Pastel Pink
  ];
  selectedColor = this.availableColors[0];
  
  // Reactive data stream
  selectedNoteToView: Note | null = null;
  selectedNoteToEdit: Note | null = null;
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

    this.editForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(300)]],
      colorHex: ['']
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
      error: (err) => this.logger.error('Error creating note:', err.message)
    });
  }

  deleteNote(id: string) {
    this.noteIdToDelete.set(id);
    this.deleteModal.open();
  }

  confirmDelete() {
    const id = this.noteIdToDelete();
    if (!id) return;

    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.noteIdToDelete.set(null);
        this.refreshNotes.next();
      },
      error: (err) => this.logger.error('Error deleting note:', err.message)
    });
  }

  editNote(note: Note) {
    this.selectedNoteToEdit = note;
    
    this.editForm.patchValue({
      text: note.text,
      colorHex: note.colorHex
    });
    this.logger.log('Edit clicked for note:', note.id);
  }

  saveEditedNote() {
    if (this.editForm.invalid || !this.selectedNoteToEdit) return;

    const payload = {
      id: this.selectedNoteToEdit.id,
      text: this.editForm.value.text.trim(),
      colorHex: this.editForm.value.colorHex
    };

    this.noteService.updateNote(payload.id, payload).subscribe({
      next: () => {
        this.closeEditNoteModal();
        this.refreshNotes.next();
      },
      error: (err) => this.logger.error('Error updating note:', err.message)
    });
  }


  openNoteModal(note: Note) {
    this.selectedNoteToView = note;
  }

  closeNoteModal() {
    this.selectedNoteToView = null;
  }

  closeEditNoteModal(){
    this.selectedNoteToEdit = null;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icons/icon.component';
import { DatePipe } from '@angular/common';
import { Note } from '../../../core/services/note';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [IconComponent, DatePipe],
  templateUrl: './note.html',
  styleUrl: './note.scss',
})
export class NoteComponent {
  @Input({required: true}) note!: Note;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Note>();
  @Output() view = new EventEmitter<Note>();

  onNoteClick() {
    this.view.emit(this.note);
  }
  
  onNoteEdit(){
    this.edit.emit(this.note);
  }
  
  onNoteDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.note.id);
  }
}

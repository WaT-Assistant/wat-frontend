import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Note } from '../../../../../core/services/note';

@Component({
  selector: 'app-edit-note-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-note-modal.html',
  styleUrl: './edit-note-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNoteModalComponent {
  @Input() note: Note | null = null;
  @Input() editForm!: FormGroup;
  @Input() availableColors: string[] = [];
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }
}

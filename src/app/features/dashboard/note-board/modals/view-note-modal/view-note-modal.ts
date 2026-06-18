import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../../../core/services/note';

@Component({
  selector: 'app-view-note-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-note-modal.html',
  styleUrl: './view-note-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewNoteModalComponent {
  @Input() note: Note | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}

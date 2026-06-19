import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'app-delete-info-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './delete-info-modal.html',
  styleUrl: './delete-info-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteInfoModalComponent {
  @Input() isOpen = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}

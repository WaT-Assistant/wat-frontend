import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icons/icon.component';

@Component({
  selector: 'app-delete-offer-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './delete-offer-modal.html',
  styleUrl: './delete-offer-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteOfferModalComponent {
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

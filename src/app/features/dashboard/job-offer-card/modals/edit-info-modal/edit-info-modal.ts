import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-info-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-info-modal.html',
  styleUrl: './edit-info-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInfoModalComponent {
  @Input() isOpen = false;
  @Input() infoForm!: FormGroup;
  @Input() importantInfo: any = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}

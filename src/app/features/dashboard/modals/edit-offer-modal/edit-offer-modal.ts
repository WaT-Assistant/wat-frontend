import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icons/icon.component';

export interface MyOffer {
  id: string;
  position: string;
  employer: string;
  placeOfWork: string;
  payPerHour: number;
  housingProvided: boolean;
  housingCostPerWeek: number;
  year: number;
  isPublished: boolean;
}

@Component({
  selector: 'app-edit-offer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './edit-offer-modal.html',
  styleUrl: './edit-offer-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOfferModalComponent {
  @Input() isOpen = false;
  @Input() selectedOffer: MyOffer | null = null;
  @Input() offerForm!: FormGroup;
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.offerForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}

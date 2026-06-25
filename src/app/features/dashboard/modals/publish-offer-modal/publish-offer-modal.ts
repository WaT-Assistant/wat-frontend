import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icons/icon.component';
import type { MyOffer } from '../../dashboard-models.ts';

export interface PublishOfferPayload {
  rating: number;
  feedback: string;
}

@Component({
  selector: 'app-publish-offer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './publish-offer-modal.html',
  styleUrls: ['./publish-offer-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishOfferModalComponent {
  readonly isOpen = input(false);
  readonly offer = input<MyOffer | null>(null);
  readonly isLoading = input(false);

  readonly close = output<void>();
  readonly publish = output<PublishOfferPayload>();

  private readonly fb = inject(FormBuilder);
  readonly stars = [1, 2, 3, 4, 5];
  readonly publishForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    feedback: [''],
  });

  constructor() {
    effect(() => {
      if (this.isOpen() && this.offer()) {
        this.publishForm.reset({ rating: 5, feedback: '' });
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  setRating(stars: number) {
    this.publishForm.patchValue({ rating: stars });
  }

  onPublish() {
    if (this.publishForm.invalid || !this.offer()) {
      this.publishForm.markAllAsTouched();
      return;
    }

    const { rating, feedback } = this.publishForm.getRawValue();
    this.publish.emit({
      rating: rating ?? 5,
      feedback: feedback ?? '',
    });
  }
}
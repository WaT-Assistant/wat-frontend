import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { JobOfferService } from '../../core/services/joboffer';
import { JobOfferCardComponent } from './job-offer-card/job-offer-card';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, switchMap, BehaviorSubject, tap } from 'rxjs';
import { NoteBoard } from './note-board/note-board';
import { EditOfferModalComponent } from './modals/edit-offer-modal/edit-offer-modal';
import { DeleteOfferModalComponent } from './modals/delete-offer-modal/delete-offer-modal';
import { PublishOfferModalComponent, type PublishOfferPayload } from './modals/publish-offer-modal/publish-offer-modal';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../core/services/toast.service';
import type { MyOffer } from './dashboard-models';

export type { ImportantInfo, MyOffer } from './dashboard-models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, JobOfferCardComponent, IconComponent, NoteBoard, EditOfferModalComponent, DeleteOfferModalComponent, PublishOfferModalComponent, ToastComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private jobOfferService = inject(JobOfferService);
  private refreshOffers = new BehaviorSubject<void>(undefined);
  myOffers$ = this.refreshOffers.pipe(
    switchMap(() => this.jobOfferService.getUserOffers()),
    tap(() => this.cdr.markForCheck())
  );
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  selectedOffer: MyOffer | null = null;
  private currentYear = new Date().getFullYear();
  isModalOpen = false;
  isLoading = false;

  errorMessage: string | null = null;
  isDeleteModalOpen = false;
  offerIdToDelete: string | null = null;

  isPublishModalOpen = false;
  offerToPublish: MyOffer | null = null;
  
  offerForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.offerForm = this.fb.group({
      position: ['', Validators.required],
      employer: ['', Validators.required],
      placeOfWork: ['', Validators.required],
      payPerHour: [null, [Validators.required, Validators.min(0)]],
      year: [this.currentYear, 
        [Validators.required, 
          Validators.min(this.currentYear - 6),
        Validators.max(this.currentYear + 1)]
      ],
      housingProvided: [false],
      housingCostPerWeek: [null]
    });
  }

  openAddModal() {
  this.errorMessage = null;
  this.selectedOffer = null;
  this.offerForm.reset({ year: 2026, housingProvided: false }); 
  this.isModalOpen = true;
}

openEditModal(offerToEdit: any) {
  this.selectedOffer = offerToEdit;
  this.offerForm.patchValue(offerToEdit); // fetch existing data to editing form
  this.isModalOpen = true;
}

  closeModal() {
    this.isModalOpen = false;
  }


openDeleteModal(id: string) {
  this.offerIdToDelete = id;
  this.isDeleteModalOpen = true;
}

closeDeleteModal() {
  this.isDeleteModalOpen = false;
  this.offerIdToDelete = null;
}

confirmDelete() {
  if (!this.offerIdToDelete) return;

  this.jobOfferService.deleteOffer(this.offerIdToDelete).subscribe({
    next: () => {
      console.log('Job offer successfully deleted.');
      this.refreshOffers.next(); 
      this.closeDeleteModal(); 
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('Failed to delete the offer:', err);
      this.closeDeleteModal();
    }
  });
}

  saveOffer() {
  this.errorMessage = null;

  if (this.offerForm.invalid) {
    this.offerForm.markAllAsTouched();
    this.errorMessage = this.getSpecificErrorMessage();
    return;
  }

  this.isLoading = true;
  const formValues = this.offerForm.value;

  const payload = {
    position: formValues.position,
    employer: formValues.employer,
    placeOfWork: formValues.placeOfWork,
    payPerHour: formValues.payPerHour,
    year: formValues.year,
    housingProvided: formValues.housingProvided,
    housingCostPerWeek: formValues.housingProvided ? formValues.housingCostPerWeek : null 
  };

  if (this.selectedOffer?.id) {
    this.jobOfferService.editOffer(this.selectedOffer.id, payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck(); 
      })
    ).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.selectedOffer = null;
        this.refreshOffers.next(); 
      },
      error: (err) => {
        console.error('Failed to update offer:', err);
        this.errorMessage = 'An error occurred while updating the offer.';
        this.cdr.markForCheck();
      }
    });
  } else {
    this.jobOfferService.createOffer(payload).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.markForCheck(); 
      })
    ).subscribe({
      next: () => {
        this.isModalOpen = false; 
        this.refreshOffers.next(); 
      },
      error: (err) => {
        if (err.error?.errors) {
          const firstErrorKey = Object.keys(err.error.errors)[0];
          this.errorMessage = err.error.errors[firstErrorKey][0];
        } else {
          this.errorMessage = 'Something went wrong on the server.';
        }
        this.cdr.markForCheck();
      }
    });
  }

}

openPublishModal(offer: MyOffer) {
  this.offerToPublish = offer;
  this.isPublishModalOpen = true;
}

closePublishModal() {
  this.isPublishModalOpen = false;
  this.offerToPublish = null;
}

confirmPublish(payload: PublishOfferPayload) {
  if (!this.offerToPublish) return;

  this.isLoading = true;

  this.jobOfferService.publishOffer(this.offerToPublish.id, payload).pipe(
    finalize(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    })
  ).subscribe({
    next: () => {
      console.log('Job offer successfully published.');
      this.refreshOffers.next();
      this.closePublishModal();
    },
    error: (err) => {
      console.error('Failed to publish the offer:', err);
      this.closePublishModal();
    }
  });
}

onUnpublish(offer: MyOffer) {
  this.jobOfferService.unpublishOffer(offer.id).subscribe({
    next: () => {
      console.log('Job offer successfully unpublished.');
      this.refreshOffers.next();
      this.cdr.markForCheck();

      this.toastService.showUndo(
        'Offer unpublished',
        'Hidden from public board',
        () => this.republish(offer)
      );
    },
    error: (err) => {
      console.error('Failed to unpublish the offer:', err);
    }
  });
}

private republish(offer: MyOffer) {
  const payload = {
    rating: offer.rating ?? 5,
    feedback: offer.feedback ?? ''
  }

  this.isLoading = true;
  this.jobOfferService.publishOffer(offer.id, payload).pipe(
    finalize(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    })
  ).subscribe({
    next: () => {
      console.log('Job offer successfully republished.');
      this.refreshOffers.next();
    },
    error: (err) => {
      console.error('Failed to republish the offer:', err);
    }
  });
}

  private getSpecificErrorMessage(): string {
    const controls = this.offerForm.controls;

    if (controls['position']?.hasError('required')) return 'Please enter the position title.';
    if (controls['employer']?.hasError('required')) return 'Please enter the employer name.';
    if (controls['placeOfWork']?.hasError('required')) return 'Please specify the location.';

    if (controls['payPerHour']?.hasError('required')) return 'Pay per hour is required.';
    if (controls['payPerHour']?.hasError('min')) return 'Pay per hour must be greater than $0.';

    if (controls['year']?.hasError('required')) return 'Year is required.';
    if (controls['year']?.hasError('min')) return 'Year cannot be earlier than 2020.';
    if (controls['year']?.hasError('max')) {
      const maxYear = new Date().getFullYear() + 1;
      return `Year cannot be later than ${maxYear}.`;
    }

    if (controls['housingCostPerWeek']?.hasError('min')) return 'Housing cost cannot be negative.';

    return 'Please check the highlighted fields.';
  }
}

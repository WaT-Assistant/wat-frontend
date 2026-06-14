import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon.component';
import { ImportantInfoService } from '../../../core/services/importantinfo';
import { finalize } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ImportantInfo } from '../../../features/dashboard/dashboard';

@Component({
  selector: 'app-job-offer-card',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule],
  templateUrl: './job-offer-card.html'
})
export class JobOfferCardComponent {
  @Input({ required: true }) offer!: any;
  
  private infoService = inject(ImportantInfoService); 
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  isEditingInfo: boolean = false;
  infoForm!: FormGroup;

  importantInfo: any = null; 
  isLoadingInfo = false;
  hasLoaded = false; 

  openEditMode() {
    this.isEditingInfo = true;
    
    this.infoForm = this.fb.group({
      sevisId: [this.importantInfo?.sevisId || ''],
      ds160: [this.importantInfo?.ds160],
      startOfWork: [this.formatDateForInput(this.importantInfo?.startOfWork)],
      endOfWork: [this.formatDateForInput(this.importantInfo?.endOfWork)],
      visaAppointment: [this.formatDateForInput(this.importantInfo?.visaAppointment)],
      flightDate: [this.formatDateForInput(this.importantInfo?.flightDate)]
    });
  }

  cancelEdit() {
    this.isEditingInfo = false;
  }

  saveInfo() {
  this.isLoadingInfo = true; 
  const formValues = this.infoForm.value;

  const payload: ImportantInfo = {
    sevisId: formValues.sevisId,
    ds160: formValues.ds160,
    startOfWork: formValues.startOfWork || null,
    endOfWork: formValues.endOfWork || null,
    visaAppointment: formValues.visaAppointment || null,
    flightDate: formValues.flightDate || null
  };

  this.infoService.editImportantInfo(this.offer.id, payload).pipe(
    finalize(() => {
      this.isLoadingInfo = false;
      this.cdr.detectChanges(); 
    })
  ).subscribe({
    next: (savedData) => {
      this.importantInfo = savedData; 
      this.isEditingInfo = false; 
    },
    error: (err) => {
      console.error('Error occured while saving', err);
    }
  });
}

  private formatDateForInput(dateString?: string): string {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return ''; 
      return d.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  }

  onAccordionToggle(event: Event) {
    const details = event.target as HTMLDetailsElement;
    
    if (details.open && !this.hasLoaded) {
      this.fetchImportantInfo();
    }
  }

  private fetchImportantInfo() {
    this.isLoadingInfo = true;
    
    this.infoService.getImportantInfoByOfferId(this.offer.id).pipe(
      finalize(() => {
        this.isLoadingInfo = false;
        this.hasLoaded = true;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (data) => {
        this.importantInfo = data;
      },
      error: (err) => {
        console.error('Failed to load info', err);
        this.importantInfo = null;
      }
    });
  }

  deleteInfo() {
  if (!this.importantInfo?.id) {
    return;
  }

  if (!confirm('Are you sure you want to delete this information?')) {
    return;
  }

  this.isLoadingInfo = true; 

  this.infoService.deleteImportantInfo(this.importantInfo.id).pipe(
    finalize(() => {
      this.isLoadingInfo = false;
      this.cdr.detectChanges(); 
    })
  ).subscribe({
    next: () => {
      this.importantInfo = null; 
    },
    error: (err) => {
      console.error('Error occured while deleting', err);
      // Тут можна додати якийсь тост/алерт з помилкою, якщо є
    }
  });
}
}
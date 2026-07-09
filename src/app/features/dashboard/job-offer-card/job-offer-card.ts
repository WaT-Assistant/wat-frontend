import { Component, Input, inject, ChangeDetectorRef, EventEmitter, Output, HostListener, ElementRef,
  ViewChild
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icons/icon.component';
import { EditInfoModalComponent } from './modals/edit-info-modal/edit-info-modal';
import { DeleteInfoModalComponent } from './modals/delete-info-modal/delete-info-modal';
import { ImportantInfoService } from '../../../core/services/importantinfo';
import { finalize } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {LoggerService} from '../../../core/services/logger.service';
import type { MyOffer } from '../../../features/dashboard/dashboard-models';

@Component({
  selector: 'app-job-offer-card',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, EditInfoModalComponent, DeleteInfoModalComponent],
  templateUrl: './job-offer-card.html'
})
export class JobOfferCardComponent {
  @Input({ required: true }) offer!: MyOffer;

  @Output() edit = new EventEmitter<MyOffer>();
  @Output() delete = new EventEmitter<string>();
  @Output() publish = new EventEmitter<MyOffer>();
  @Output() unpublish = new EventEmitter<MyOffer>();

  @ViewChild('menuContainer') menuContainer!: ElementRef;
  
  private infoService = inject(ImportantInfoService); 
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private logger = inject(LoggerService);

  isEditingInfo: boolean = false;
  infoForm!: FormGroup;

  importantInfo: any = null; 
  isLoadingInfo = false;
  hasLoaded = false; 
  isMenuOpen = false;
  isDeleteInfoModalOpen = false;
  documentIdToDelete: string | null = null;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isMenuOpen && this.menuContainer && 
      !this.menuContainer.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  onEditClick() {
    this.isMenuOpen = false;
    this.edit.emit(this.offer);
  }

  onDeleteClick() {
    this.isMenuOpen = false; 
    this.delete.emit(this.offer.id);
  }


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

openDeleteInfoModal(id: string) {
  this.documentIdToDelete = id;
  this.isDeleteInfoModalOpen = true;
}

closeDeleteInfoModal() {
  this.isDeleteInfoModalOpen = false;
  this.documentIdToDelete = null;
}

confirmDeleteDoc() {
  if (!this.documentIdToDelete) return;

  this.infoService.deleteImportantInfo(this.documentIdToDelete).subscribe({
    next: () => {
      this.logger.log('Document info successfully deleted.');
      this.importantInfo = null;
      this.closeDeleteInfoModal();
      this.cdr.markForCheck();
    },
    error: (err: any) => {
      this.logger.error('Failed to delete document info: ', err.message);
      this.closeDeleteInfoModal();
    }
  });
}

  togglePublish(){
    if(!this.offer.isPublished)
      this.publish.emit(this.offer);
    else{
      this.unpublish.emit(this.offer);
    }
  }

  saveInfo() {
  this.isLoadingInfo = true; 
  const formValues = this.infoForm.value;

  const payload = {
    sevisId: formValues.sevisId,
    ds160: formValues.ds160,
    startOfWork: formValues.startOfWork || null,
    endOfWork: formValues.endOfWork || null,
    visaAppointment: formValues.visaAppointment || null,
    flightDate: formValues.flightDate || null 
  };

  if (this.importantInfo?.id) {
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
      error: (err) => this.logger.error('Error on updating', err.message)
    });
  } 
  
  else {
    this.infoService.createImportantInfo(this.offer.id, payload).pipe(
      finalize(() => {
        this.isLoadingInfo = false;
        this.cdr.detectChanges(); 
      })
    ).subscribe({
      next: (createdData) => {
        this.importantInfo = createdData;
        this.isEditingInfo = false; 
      },
      error: (err) => this.logger.error('Error on creating', err.message)
    });
  }
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
    this.logger.log('1) Request working. Turn on loader');
    this.infoService.getImportantInfoByOfferId(this.offer.id).pipe(
      finalize(() => {
        this.logger.log('3) finalize worked, turn off loader');
        this.isLoadingInfo = false;
        this.hasLoaded = true;
        this.cdr.markForCheck();
      })
    )
    .subscribe({
      next: (data) => {
        this.logger.log('2) data fetched to component: ', data);
        this.importantInfo = data;
      },
      error: (err) => {
        this.logger.error('Failed to load info', err.message);
        this.importantInfo = null;
      }
    });
 }
}
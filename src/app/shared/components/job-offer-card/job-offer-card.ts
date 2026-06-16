import { Component, Input, inject, ChangeDetectorRef, EventEmitter, Output, HostListener, ElementRef,
  ViewChild
 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon.component';
import { ImportantInfoService } from '../../../core/services/importantinfo';
import { finalize } from 'rxjs';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MyOffer } from '../../../features/dashboard/dashboard';

@Component({
  selector: 'app-job-offer-card',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule],
  templateUrl: './job-offer-card.html'
})
export class JobOfferCardComponent {
  @Input({ required: true }) offer!: any;

  @Output() edit = new EventEmitter<MyOffer>();
  @Output() delete = new EventEmitter<string>();

  @ViewChild('menuContainer') menuContainer!: ElementRef;
  
  private infoService = inject(ImportantInfoService); 
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  isEditingInfo: boolean = false;
  infoForm!: FormGroup;

  importantInfo: any = null; 
  isLoadingInfo = false;
  hasLoaded = false; 
  isMenuOpen = false;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isMenuOpen && this.menuContainer && 
      !this.menuContainer.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    // event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }


  onEditClick() {
    // event.stopPropagation();
    // console.log("Clicked edit");
    this.isMenuOpen = false;
    this.edit.emit(this.offer);
  }

  onDeleteClick() {
    // event.stopPropagation();
    // console.log("Clicked delete");
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
      error: (err) => console.error('Error on updating', err)
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
      error: (err) => console.error('Error on creating', err)
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
    console.log('1) Request working. Turn on loader');
    this.infoService.getImportantInfoByOfferId(this.offer.id).pipe(
      finalize(() => {
        console.log('3) finalize worked, turn off loader');
        this.isLoadingInfo = false;
        this.hasLoaded = true;
        this.cdr.markForCheck();
      })
    )
    .subscribe({
      next: (data) => {
        console.log('2) data fetched to component: ', data);
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
    }
  });
}
}
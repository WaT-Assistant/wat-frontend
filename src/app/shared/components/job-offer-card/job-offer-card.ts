import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icon.component';
import { ImportantInfoService } from '../../../core/services/importantinfo';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-job-offer-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './job-offer-card.html'
})
export class JobOfferCardComponent {
  @Input({ required: true }) offer!: any;
  
  private infoService = inject(ImportantInfoService); 

  private cdr = inject(ChangeDetectorRef);

  importantInfo: any = null; 
  isLoadingInfo = false;
  hasLoaded = false; 

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
}
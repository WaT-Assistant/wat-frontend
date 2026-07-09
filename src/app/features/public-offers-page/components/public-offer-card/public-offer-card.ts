import { Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { PublicOffer } from '../../public-offers-page';
import { IconComponent } from '../../../../shared/components/icons/icon.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-public-offer-card',
  imports: [IconComponent, DecimalPipe],
  templateUrl: './public-offer-card.html',
  styleUrl: './public-offer-card.scss',
})
export class PublicOfferCard {
  @Input({ required: true }) offer!: PublicOffer;
  isFeedbackExpanded: boolean = false;
  @ViewChild('feedbackText') feedbackText!: ElementRef<HTMLParagraphElement>;
  showReadMoreBtn = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkOverflow();
    }, 0);
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isFeedbackExpanded) {
      this.checkOverflow();
    }
  }

  private checkOverflow() {
    if (this.feedbackText) {
      const el = this.feedbackText.nativeElement;
      
      this.showReadMoreBtn = el.scrollHeight > el.clientHeight;
      this.cdr.detectChanges(); 
    }
  }
}

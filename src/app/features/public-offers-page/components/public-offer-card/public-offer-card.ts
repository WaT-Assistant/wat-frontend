import { Component, Input } from '@angular/core';
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
}

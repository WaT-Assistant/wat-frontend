import { Component, Input } from '@angular/core';
import { PublicOffer } from '../../public-offers-page';

@Component({
  selector: 'app-public-offer-card',
  imports: [],
  templateUrl: './public-offer-card.html',
  styleUrl: './public-offer-card.scss',
})
export class PublicOfferCard {
  @Input({ required: true }) offer!: PublicOffer;
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOfferCard } from './public-offer-card';

describe('PublicOfferCard', () => {
  let component: PublicOfferCard;
  let fixture: ComponentFixture<PublicOfferCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicOfferCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicOfferCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

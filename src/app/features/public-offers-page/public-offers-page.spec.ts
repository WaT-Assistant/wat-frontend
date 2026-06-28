import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOffersPage } from './public-offers-page';

describe('PublicOffersPage', () => {
  let component: PublicOffersPage;
  let fixture: ComponentFixture<PublicOffersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicOffersPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicOffersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

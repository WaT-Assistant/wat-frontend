import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferCard } from './job-offer-card';

describe('JobOfferCard', () => {
  let component: JobOfferCard;
  let fixture: ComponentFixture<JobOfferCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOfferCard],
    }).compileComponents();

    fixture = TestBed.createComponent(JobOfferCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

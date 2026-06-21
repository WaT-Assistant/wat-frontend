import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { PublicOfferCard } from './components/public-offer-card/public-offer-card';
import { JobOfferService } from '../../core/services/joboffer';

export interface PublicOffer{
  id: string;
  position: string;
  employer: string;
  placeOfWork: string;
  payPerHour: number;
  housingProvided: boolean;
  housingCostPerWeek: number;
  year: number;
  isPublished: boolean;
  feedback?: string | null;
  rating?: number | null;   
}

@Component({
  selector: 'app-public-offers-page',
  imports: [PublicOfferCard],
  templateUrl: './public-offers-page.html',
  styleUrl: './public-offers-page.scss',
})
export class PublicOffersPage implements OnInit, AfterViewInit {
  private offerService = inject(JobOfferService);

  publicOffers: PublicOffer[] = [];
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  hasMoreOffers = true;

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  ngOnInit() {
    this.loadOffers();
  }

  ngAfterViewInit() {
    this.setupObserver();
  }

  loadOffers() {
    if (this.isLoading || !this.hasMoreOffers) return;

    this.isLoading = true;

    this.offerService.getPublicOffers(this.currentPage, this.pageSize).subscribe({
      next: (offers) => {
        this.publicOffers = [...this.publicOffers, ...offers];
        
        if (offers.length < this.pageSize) {
          this.hasMoreOffers = false;
        }
        
        this.currentPage++;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offers', err);
        this.isLoading = false;
      }
    });
  }

  private setupObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading) {
        this.loadOffers();
      }
    }, options);

    if (this.scrollAnchor) {
      observer.observe(this.scrollAnchor.nativeElement);
    }
  }
}

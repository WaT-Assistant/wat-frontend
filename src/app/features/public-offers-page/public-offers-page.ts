import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
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
  authorName?: string | null;   
}

@Component({
  selector: 'app-public-offers-page',
  imports: [PublicOfferCard],
  templateUrl: './public-offers-page.html',
  styleUrl: './public-offers-page.scss',
})
export class PublicOffersPage implements OnInit, AfterViewInit {
  private offerService = inject(JobOfferService);
  private cdr = inject(ChangeDetectorRef);
  private observer?: IntersectionObserver;

  publicOffers: PublicOffer[] = [];
  currentPage = 1;
  pageSize = 12;
  isLoading = false;
  hasMoreOffers = true;

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

  ngOnInit() {
    this.loadOffers();
  }

  ngAfterViewInit() {
    this.setupObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  loadOffers() {
    if (this.isLoading || !this.hasMoreOffers) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.offerService.getPublicOffers(this.currentPage, this.pageSize).subscribe({
      next: (offers) => {
        const safeOffers = offers || [];

        this.publicOffers = [...this.publicOffers, ...safeOffers];

        if (safeOffers.length < this.pageSize) {
          this.hasMoreOffers = false;
        }

        this.currentPage++;
        this.isLoading = false;
        this.cdr.detectChanges();

        this.queueViewportFillCheck();

      },
      error: (err) => {
        console.error('Error loading offers', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private setupObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading) {
          this.loadOffers();
      }
    }, options);

    if (this.scrollAnchor) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  private queueViewportFillCheck() {
    requestAnimationFrame(() => this.fillViewportIfNeeded());
  }

  private fillViewportIfNeeded() {
    if (this.isLoading || !this.hasMoreOffers) return;

    if (document.documentElement.scrollHeight <= window.innerHeight) {
      this.loadOffers();
    }
  }
}

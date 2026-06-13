import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { JobOfferService } from '../../core/services/joboffer';
import { IconComponent } from '../../shared/components/icons/icon.component';

export interface ImportantInfo {
  id?: string;
  sevisID?: string;
  visaAppointment?: Date;
  flight?: Date;
  ds160?: string;
  ds2019?: string;
}

export interface MyOffer {
  id: string;
  position: string;
  employer: string;
  placeOfWork: string;
  payPerHour: number;
  housingProvided: boolean;
  housingCostPerWeek: number;
  status: number;
  year: number;
  isPublished: boolean;
  
  rating?: number | null;   
  
  importantInfo?: ImportantInfo; 
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, IconComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  private jobOfferService = inject(JobOfferService);
  myOffers$ = this.jobOfferService.getUserOffers();
}
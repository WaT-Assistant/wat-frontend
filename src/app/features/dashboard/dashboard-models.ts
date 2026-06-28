export interface ImportantInfo {
  id?: string;
  sevisId?: string;
  visaAppointment?: Date;
  flightDate?: Date;
  ds160?: string;
  startOfWork?: Date;
  endOfWork?: Date;
}

export interface MyOffer {
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

  importantInfo?: ImportantInfo;
}
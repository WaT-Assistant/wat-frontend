import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.log(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}
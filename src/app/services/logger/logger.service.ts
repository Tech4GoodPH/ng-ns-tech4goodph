import { Injectable } from '@angular/core';

/**
 * Logger service for printing and saving application log messages
 * TODO: log to a text file
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  error (message: string, obj?: any) {
    console.error(`****************** ${message}`, obj);
  }

  debug (message: string, obj?: any) {
    console.log(`****************** ${message}`);
    if (obj) {
      console.log(obj);
    }
  }
}

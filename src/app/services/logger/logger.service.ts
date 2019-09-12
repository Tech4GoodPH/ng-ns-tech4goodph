import { Injectable } from '@angular/core';

/**
 * TODO: log to a text file
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  debug (message: string, obj?: any) {
    console.log(`****************** APP-LOG: ${message}`);
    if (obj) {
      console.log(obj);
    }
  }
}

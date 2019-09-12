import { Injectable } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  /**
   * Returns an array of Photos with random locations
   * @param length - optional number of photos in the returned array
   */
  generatePhotosArray(length: number = 5): Photo[] {
    const photosArray: Photo[] = [];
    for (let i = 0; i < length; i++) {
      photosArray.push(new Photo());
    }

    return photosArray
  }
}

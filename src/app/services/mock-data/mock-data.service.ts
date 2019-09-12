import { Injectable } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { LoggerService } from '../logger/logger.service';
import { ApiAccessService } from '../api-access/api-access.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor(
    private loggerService: LoggerService,
    private apiService: ApiAccessService
  ) { }

  /**
   * Returns an array of Photos with random locations
   * @param length - optional number of photos in the returned array
   */
  generatePhotosArray(length: number = 5): Photo[] {
    const photosArray: Photo[] = [];
    for (let i = 0; i < length; i++) {
      const photo = new Photo();
      photo.id = this.apiService.generatePhotoId()
      photosArray.push(photo);
    }

    this.loggerService.debug(`[MockDataComponent generatePhotosArray] ${photosArray.length} generated`);
    return photosArray
  }

  /**
   * Returns a Photo with a random location
   */
  generatePhoto(): Photo {
    const photo = new Photo();
    photo.id = this.apiService.generatePhotoId();
    this.loggerService.debug(`[MockDataComponent generatePhoto] ${photo.id}`);
    return photo;
  }
}

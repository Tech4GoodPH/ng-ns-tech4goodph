import { Injectable } from '@angular/core';
import { Photo, Rating } from '~/app/interfaces/photo.interface';
import { LoggerService } from '../logger/logger.service';
import { ApiAccessService } from '../api-access/api-access.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor(
    private configurationService: ConfigurationService,
    private loggerService: LoggerService,
    private apiService: ApiAccessService
  ) { }

  randomizeLocations(photosArray: Photo[], lat: number, lng: number) {
    photosArray.forEach(photo => {
      if (typeof lat !== 'undefined') {
        photo.lat = lat + (Math.random() * 0.201) - .1;
      }

      if (typeof lng !== 'undefined') {
        photo.lng = lng  + (Math.random() * 0.201) - .1;
      }
    });
  }

  /**
   * Returns an array of Photos with random locations
   * @param length - optional number of photos in the returned array
   */
  generatePhotosArray(length: number = 5, lat?: number, lng?: number): Photo[] {
    const photosArray: Photo[] = [];
    for (let i = 0; i < length; i++) {
      const photo = new Photo();

      if (typeof lat !== 'undefined') {
        photo.lat = lat + (Math.random() * 0.201) - .1;
      }

      if (typeof lng !== 'undefined') {
        photo.lng = lng  + (Math.random() * 0.201) - .1;
      }

      photo.id = this.apiService.generatePhotoId();
      photo.rating = Math.round(Math.random() * 2);
      if (photo.rating === Rating.Bad) {
        photo.url = '~/assets/garbage-bad.jpg';
      } else {
        photo.url = '~/assets/garbage-good.jpg';
      }
      photosArray.push(photo);
    }

    this.loggerService.debug(`[MockDataComponent generatePhotosArray] ${photosArray.length} generated`);
    return photosArray;
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

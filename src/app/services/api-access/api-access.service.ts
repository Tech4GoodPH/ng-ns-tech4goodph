import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { Photo } from '~/app/interfaces/photo.interface';
import { IMessage } from '~/app/interfaces/message.interface';
import { LoggerService } from '../logger/logger.service';

export const PHOTOS_STORAGE_KEY = 'LocalPhotosArray';

/**
 * Service for communicating with API and the local storage
 */
@Injectable({
  providedIn: 'root'
})
export class ApiAccessService {

  constructor (
    private localStorage: LocalStorageService,
    private loggerService: LoggerService
  ) { }

  /**
   * IN PROGRESS : will upload photo to the backend
   * @param photo - photo to be uploaded
   */
  uploadPhoto(photo: Photo): IMessage {

    this.loggerService.debug(`[ApiAccessService uploadPhoto] ${photo.id}`);
    return this.saveToLocal(photo);
  }

  /**
   * IN PROGRESS : will return photo with unique id
   * @param photoId - unique id of the photo
   */
  getPhoto(photoId: string): Photo {
    this.loggerService.debug(`[ApiAccessService getPhoto] ${photoId}`);
    return this.getLocalPhoto(photoId);
  }

  /**
   * IN PROGRESS : will return list of all photos from the backend
   */
  listPhotos(): Photo[] {
    const photosArray = this.listLocalPhotos();

    this.loggerService.debug(`[ApiAccessService listPhotos] ${photosArray.length} found.`);
    return photosArray;
  }

  /**
   * Returns an array of photos stored in the local storage
   */
  listLocalPhotos(): Photo[] {
    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);
    photosArray = photosArray || [];
    this.restoreTimeStamps(photosArray);
    this.loggerService.debug(`[ApiAccessService listLocalPhotos] ${photosArray.length} found`);
    return photosArray;
  }

  /**
   * Saves the photo to the local storage
   * @param photo - photo object to be saved in the local storage
   */
  saveToLocal(photo: Photo | Photo[]): IMessage {
    if (!photo) {
      this.loggerService.debug(`[ApiAccessService saveToLocal] no photo found`);
      return {
        success: false,
        message: 'photo undefined'
      };
    }

    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);

    if (typeof photosArray === 'undefined') {
      photosArray = [];
    }

    if (Array.isArray(photo)) {
      const id = this.generatePhotoId();
      photo.forEach(photoItem => {
        photoItem.id = photoItem.id === '' ?  `${parseInt(id, 10) + 1}` : photoItem.id;
      });
      this.loggerService.debug(`[ApiAccessService saveToLocal] ${photo.length} photos saved`);
      photosArray = [...photosArray, ...photo];
    } else {
      photo.id = photo.id === '' ? this.generatePhotoId() : photo.id;
      photosArray.push(photo);
      this.loggerService.debug(`[ApiAccessService saveToLocal] ${photo.id}`);
    }

    this.localStorage.setItem(PHOTOS_STORAGE_KEY, photosArray);

    return {
      success: true
    };
  }

  /**
   * Returns photo with id
   * @param photoId - unique id of photo
   */
  getLocalPhoto(photoId: string): Photo {
    const photosArray = this.listLocalPhotos();
    const photo = photosArray.find(photo => photo.id === photoId);
    this.loggerService.debug(`[ApiAccessService getLocalPhoto] ${photo.id}`);
    return photo;
  }

  /**
   * Deletes the photo data in local storage
   * @param photoId - unique id of photo to be removed
   */
  removeFromLocal(photoId: string) {
    const photosArray = this.listLocalPhotos();
    this.localStorage.clear();
    this.saveToLocal(photosArray.filter(photo => photo.id !== photoId));
  }

  /**
   * generates a unique id string
   */
  generatePhotoId(): string {
    const photosArray = this.listLocalPhotos();

    // from https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
    const S4 = function() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    const id = (S4() + S4() + "-" + S4() +'-'+ S4() +'-'+ S4() + "-" + S4() + S4() + S4());
    this.loggerService.debug(`[ApiAccessService generatePhotoId] ${id}`);

    return id;
  }

  ratingToString(rating: number) {
    if (rating === 1) {
      return 'Good';
    } else if (rating === 0) {
      return 'Bad';
    }

    return 'Unknown';
  }

  /**
   * Restores all time stamps of photos from string to Date object
   * @param photosArray - array of photos
   */
  private restoreTimeStamps(photosArray: Photo[]) {
    if (Array.isArray(photosArray)) {
      photosArray.forEach(photo => {
        photo.timestamp = new Date(photo.timestamp);
      });
    }
  }

}

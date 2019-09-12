import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { Photo } from '~/app/interfaces/photo.interface';
import { IMessage } from '~/app/interfaces/message.interface';

export const PHOTOS_STORAGE_KEY = 'LocalPhotosArray';

@Injectable({
  providedIn: 'root'
})
export class ApiAccessService {

  constructor (
    private localStorage: LocalStorageService
  ) { }

  /**
   * IN PROGRESS : will upload photo to the backend
   * @param photo - photo to be uploaded
   */
  uploadPhoto(photo: Photo): IMessage {
    photo.id = this.generatePhotoId();
    return this.saveToLocal(photo);
  }

  /**
   * IN PROGRESS : will return photo with unique id
   * @param photoId - unique id of the photo
   */
  getPhoto(photoId: string): Photo {
    return this.getLocalPhoto(photoId);
  }

  /**
   * IN PROGRESS : will return list of all photos from the backend
   */
  listPhotos(): Photo[] {
    const photosArray = this.listLocalPhotos();

    return photosArray;
  }

  /**
   * Returns an array of photos stored in the local storage
   */
  listLocalPhotos(): Photo[] {
    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);
    return photosArray;
  }

  /**
   * Saves the photo to the local storage
   * @param photo - photo object to be saved in the local storage
   */
  saveToLocal(photo: Photo | Photo[]): IMessage {
    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);

    if (typeof photosArray === 'undefined') {
      photosArray = [];
    }

    if (Array.isArray(photo)) {
      photosArray = [...photosArray, ...photo]
    } else {
      photosArray.push(photo);
    }

    this.localStorage.setItem(PHOTOS_STORAGE_KEY, photosArray);

    return {
      success: true
    }
  }

  /**
   * Returns photo with id
   * @param photoId - unique id of photo
   */
  getLocalPhoto(photoId: string): Photo {
    const photosArray = this.listLocalPhotos();
    return photosArray.find(photo => photo.id === photoId);
  }

  /**
   * generates a unique id string
   */
  private generatePhotoId(): string {
    const photosArray = this.listLocalPhotos();
    return `${parseInt(this.getHighestId(photosArray))}`
  }

  private getHighestId(photosArray: Photo[]): string {
    let id = `1`;
    photosArray.forEach(photo => {
      id = parseInt(photo.id, 10) > parseInt(id, 10) ? photo.id : id;
    });
    return id;
  }

}

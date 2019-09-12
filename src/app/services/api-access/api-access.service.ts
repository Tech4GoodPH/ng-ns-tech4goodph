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
    return {
      success: true
    }
  }

  /**
   * IN PROGRESS : will return list of all photos from the backend
   */
  listPhotos(): Photo[] {
    const photosArray: Photo[] = [];

    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());
    photosArray.push(new Photo());

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
  saveToLocal(photo: Photo): IMessage {
    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);

    if (typeof photosArray === 'undefined') {
      photosArray = []
    }

    photosArray.push(photo);
    this.localStorage.setItem(PHOTOS_STORAGE_KEY, photosArray);

    return {
      success: true
    }
  }


}

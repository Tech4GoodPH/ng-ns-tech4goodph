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

  uploadPhoto(): IMessage {
    return {
      success: true
    }
  }

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

  listLocalPhotos(): Photo[] {
    let photosArray: Photo[] = this.localStorage.getItem(PHOTOS_STORAGE_KEY);
    return photosArray;
  }

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

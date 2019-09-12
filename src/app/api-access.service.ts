import { Injectable } from '@angular/core';

import { IPhoto, Photo } from './photo.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiAccessService {

  constructor() { }

  uploadPhoto() {
    return {
      success: true
    }
  }

  listPhotos(): IPhoto[] {
    const photosArray: IPhoto[] = [];

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
}

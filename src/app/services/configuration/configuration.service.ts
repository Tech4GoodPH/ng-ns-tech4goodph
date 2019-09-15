import { Injectable } from '@angular/core';
import { DEFAULT_X, DEFAULT_Y } from '~/app/interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _appName = 'Bayanihan Maps';
  private _apiUrl = '';
  private _demoMode = true;
  private _clusterPoints = false;

  private _defaultLat: number = DEFAULT_X;
  private _defaultLng: number = DEFAULT_Y;

  constructor() { }
  get appName(): string {
    return this._appName;
  }

  get demoMode(): boolean {
    return this._demoMode;
  }

  get clusterPoints(): boolean {
    return this._clusterPoints;
  }

  get defaultLat() {
    return this._defaultLat;
  }

  get defaultLng() {
    return this._defaultLng;
  }

  set defaultLat(lat: number) {
    this._defaultLat = lat;
  }

  set defaultLng (lng: number) {
    this._defaultLng = lng;
  }

  toggleDemoMode() {
    this._demoMode = !this._demoMode;
    return this._demoMode;
  }
}

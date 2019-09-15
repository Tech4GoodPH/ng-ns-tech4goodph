import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _appName = 'Bayanihan Maps';
  private _apiUrl = '';
  private _demoMode = true;
  private _clusterPoints = false;

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

  toggleDemoMode() {
    this._demoMode = !this._demoMode;
    return this._demoMode;
  }
}

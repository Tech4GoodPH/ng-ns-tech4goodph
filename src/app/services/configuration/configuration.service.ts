import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _appName = 'Bayanihan Maps';
  private _apiUrl = '';
  private _demoMode = true;

  constructor() { }
  get appName(): string {
    return this._appName;
  }

  get demoMode(): boolean {
    return this._demoMode;
  }
}

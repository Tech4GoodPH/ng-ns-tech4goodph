import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _appName = 'Bayanihan Maps';
  private _apiUrl = '';

  constructor() { }
  get appName(): string {
    return this._appName;
  }

}

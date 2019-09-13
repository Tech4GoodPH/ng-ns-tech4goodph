import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import * as appSettings from 'tns-core-modules/application-settings';

/**
 * Service for using local storage. Currently for mobile only
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private loggerService: LoggerService
  ) {}

  /**
   * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
   * for key *x*.
   */
  clear(): void {
    appSettings.clear();
  }

  /**
   * Performs the actual retrieval of a value from storage.
   *
   * @param   key Identifier of the entry whose value is to be retrieved.
   * @returns   The value that is st*ored for the specified entry or `null` if no entry exists for the specified key.
   */
  getItem<T>(key: string, parseJson = true): T {

    const value: any = appSettings.getString(key);
    if (typeof value !== 'string') {
      this.loggerService.debug(`[LocalStorageService getItem] no value found for ${key}`);
      return undefined;
    }

    this.loggerService.debug(`[LocalStorageService getItem] value found for ${key}`);
    return parseJson ? JSON.parse(value) : value;
  }

  /**
   * Checks whether an entry with the specified key exists in the storage.
   *
   * @param   key Identifier of the entry for which its presence in the storage is to be checked.
   * @returns   `true` if an entry with the specified key exists in the storage, `false` if not.
   */
  has(key: string): boolean {
    return appSettings.hasKey(key) !== null;
  }

  /**
   * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
   * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
   *
   * @param key Identifier of the entry which is to be removed.
   */
  remove(key: string): void {
    appSettings.remove(key);
  }

  removeKeys(keys: string[]): void {
    for (const key of keys) {
      appSettings.remove(key);
    }
  }

  /**
   * Stores the provided value using specified key in the storage.
   *
   * @param key   Identifier of the entry for which the value is to be stored.
   * @param value The value that is to be stored.
   */
  setItem(key: string, value: any): void {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    
    this.loggerService.debug(`[LocalStorageService setItem] ${key}`);
    return appSettings.setString(key, value);
  }

}

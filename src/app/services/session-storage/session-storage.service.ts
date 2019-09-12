import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SessionStorageService {
	private sessionStorage: Storage;

	constructor() {
		this.sessionStorage = window.sessionStorage;
	}

	/**
	 * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
	 * for key *x*.
	 */
	clear(): void {
		this.sessionStorage.clear();
	}

	/**
	 * Performs the actual retrieval of a value from storage.
	 *
	 * @param   key Identifier of the entry whose value is to be retrieved.
	 * @returns     The value that is stored for the specified entry or `undefined` if no entry exists for the specified key.
	 */
	getItem<T>(key: string, parseJson = true): T {
		const value = this.sessionStorage.getItem(key);

		if (value === null) {
			return undefined;
		}

		return parseJson ? JSON.parse(value) : value;
	}

	/**
	 * Checks whether an entry with the specified key exists in the storage.
	 *
	 * @param   key Identifier of the entry for which its presence in the storage is to be checked.
	 * @returns     `true` if an entry with the specified key exists in the storage, `false` if not.
	 */
	has(key: string): boolean {
		return this.sessionStorage.getItem(key) !== null;
	}

	/**
	 * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
	 * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
	 *
	 * @param key Identifier of the entry which is to be removed.
	 */
	remove(key: string): void {
		this.sessionStorage.removeItem(key);
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
		return this.sessionStorage.setItem(key, value);
	}

}

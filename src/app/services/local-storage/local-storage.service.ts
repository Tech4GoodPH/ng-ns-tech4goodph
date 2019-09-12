import { Injectable } from '@angular/core';

export enum LocalStorageKey {
	IconColors = 'iconColors',
	FncCreateNewSupplier = 'fnc_create_new_supplier',
	FavoriteLinks = 'favoriteLinks',
	M3Menu = 'M3Menu',
	M3MenuInfo = 'M3MenuInfo',
	MultiFinancial = 'multi://financial',
	MultiSupplier = 'multi://supplier',
	MultiSupplierSearch = 'multi://suppliersearch',
	MultiSupplierMi = 'multi://suppliermi',
	MultiTool = 'multi://tool',
	MultiWarehouse = 'multi://warehouse',
	MultiCustomerMi = 'multi://customermi',
	RecentTasks = 'recentTasks',
	WizardNewSupplier = 'wizard_new_supplier',
	GetOutput = 'getOutput',
	GetInput = 'getInput',
	UiTheme = 'Theme',
	Color = 'Color'
}

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	private localStorage: Storage;

	constructor() {
		this.localStorage = window.localStorage;
	}

	/**
	 * Clears the storage by removing all entries. Subsequent `get(x)` calls for a key *x* will return `undefined`, until a new value is set
	 * for key *x*.
	 */
	clear(): void {
		this.localStorage.clear();
	}

	/**
	 * Performs the actual retrieval of a value from storage.
	 *
	 * @param   key Identifier of the entry whose value is to be retrieved.
	 * @returns     The value that is stored for the specified entry or `null` if no entry exists for the specified key.
	 */
	getItem<T>(key: LocalStorageKey | string, parseJson = true): T {
		const value: any = this.localStorage.getItem(key);
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
	has(key: LocalStorageKey | string): boolean {
		return this.localStorage.getItem(key) !== null;
	}

	/**
	 * Removes the entry that is identified by the specified key. Attempting to remove an entry for an unknown key will have no effect.
	 * Attempting to retrieve an entry via the `get` method after it has been removed will result in `undefined`.
	 *
	 * @param key Identifier of the entry which is to be removed.
	 */
	remove(key: LocalStorageKey | string): void {
		this.localStorage.removeItem(key);
	}

	removeKeys(keys: string[]): void {
		for (const key of keys) {
			this.localStorage.removeItem(key);
		}
	}

	/**
	 * Stores the provided value using specified key in the storage.
	 *
	 * @param key   Identifier of the entry for which the value is to be stored.
	 * @param value The value that is to be stored.
	 */
	setItem(key: LocalStorageKey | string, value: any): void {
		if (typeof value === 'object') {
			value = JSON.stringify(value);
		}
		return this.localStorage.setItem(key, value);
	}

}

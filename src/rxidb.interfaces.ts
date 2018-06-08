import { Observable } from 'rxjs';

import { RxIDBStore } from './rxidb-store';

/**
 * RxIDBUpgrade provides common interface for store.
 */
export interface IRxIDBUpgrade {
  /**
   * Add store:
   * upgradeDB.addStore('MyStore', { data: new MyStore() }).subscribe();
   */
  create(key: string, options?: IDBObjectStoreParameters): void;

  /**
   * Delete store:
   * upgradeDB.deleteStore('MyStore').subscribe();
   */
  delete(key: string): void;

  /**
   * Has store:
   * upgradeDB.hasStore('MyStore').subscribe();
   */
  has(key: string): boolean;
}

/**
 * RxIDB interface
 */
export interface IRxIDB {
  get(key: IDBValidKey): RxIDBStore;
  transaction(storeNames: string | string[], mode?: 'readonly' | 'readwrite'): IDBTransaction;
}

/**
 * RxIDBStore interface
 */
export interface IRxIDBStore {
  delete(key: IDBValidKey): Observable<void>;
  get(key: IDBValidKey): Observable<any>;
  set(value: any, key?: IDBValidKey): Observable<void>;
  tx(mode?: 'readonly' | 'readwrite'): Observable<IDBTransaction>;
}

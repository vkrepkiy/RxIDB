import { Observable } from 'rxjs';

import { RxIDB } from './rxidb-db';
import { RxIDBLayers } from './rxidb.types';
import { RxIDBStore } from './rxidb-store';


/**
 * Setup RxStore by creating or removing DB
 */
export interface IRxIDBStatic {
  /**
   * Open DB:
   * RxStore.open('MyDB', 1, upgradeDB).subscribe();
   */
  open(name: string, version: number, layers: RxIDBLayers): Observable<RxIDB>;

  /**
   * Drop DB:
   * RxStore.drop('MyDB').subscribe();
   */
  drop(name: string): Observable<void>;
}

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
  get(key: IDBValidKey): RxIDBStore<any, IDBValidKey>;
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

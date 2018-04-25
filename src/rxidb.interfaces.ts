import { Observable } from 'rxjs';
import { Transaction } from 'idb';

import { RxIDBLayeredUpgrade, RxIDBStoreOptions } from './rxidb.types';
import { RxIDB } from './rxidb-db';
import { RxIDBStore } from './rxidb-store';


/**
 * Setup RxStore by creating or removing DB
 */
export interface IRxIDBStatic {
  /**
   * Open DB:
   * RxStore.open('MyDB', 1, upgradeDB).subscribe();
   */
  open(name: string, version: number, layers: RxIDBLayeredUpgrade): Observable<RxIDB>;

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
  create(key: string, options?: RxIDBStoreOptions): Observable<void>;

  /**
   * Delete store:
   * upgradeDB.deleteStore('MyStore').subscribe();
   */
  delete(key: string): Observable<void>;

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
  get(key: string): RxIDBStore;
  transaction(storeNames: string | string[], mode?: 'readonly' | 'readwrite'): Transaction;
}

/**
 * RxIDBStore interface
 */
export interface IRxIDBStore {
  delete(key: string): Observable<void>;
  get(key: string): Observable<any>;
  set(key: string, value: any): Observable<void>;
  tx(mode?: 'readonly' | 'readwrite'): Transaction;
}

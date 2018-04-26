import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IRxIDB } from './rxidb.interfaces';
import { RxIDBStore } from './rxidb-store';

export class RxIDB implements IRxIDB {
  constructor (
    public readonly idb: IDBDatabase
  ) {}

  /**
   * Close db
   */
  public close(): void {
    this.idb.close();
  }

  /**
   * Stream: get store
   */
  public get(key: string): RxIDBStore<any, IDBValidKey> {
    return new RxIDBStore(key, this);
  }

  /**
   * Stream: IDBTransaction
   */
  public tx(store: string | string[], mode: 'readonly' | 'readwrite' = 'readonly'): Observable<IDBTransaction> {
    return of(null).pipe(
      map(() => this.idb.transaction(store, mode))
    );
  }

  /**
   * Open IDBTransaction
   */
  public transaction(store: string|string[], mode: 'readonly'|'readwrite' = 'readonly'): IDBTransaction {
    return this.idb.transaction(store, mode);
  }
}

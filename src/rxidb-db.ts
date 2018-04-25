import { DB, Transaction } from 'idb';

import { IRxIDB } from './rxidb.interfaces';
import { RxIDBStore } from './rxidb-store';

export class RxIDB implements IRxIDB {
  constructor (
    private _db: DB
  ) {}

  public get(key: string) {
    return new RxIDBStore(key, this._db);
  }

  /**
   * Open transaction
   */
  public transaction(store: string|string[], mode: 'readonly'|'readwrite' = 'readonly'): Transaction {
    return this._db.transaction(store, mode);
  }
}

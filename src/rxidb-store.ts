import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { ObjectStore, DB, Transaction } from 'idb';

import { IRxIDBStore } from './rxidb.interfaces';

export class RxIDBStore implements IRxIDBStore {
  constructor(
    public key: string,
    private _db: DB
  ) {}

  delete(key: string): Observable<void> {
    return fromPromise(
      this._db.transaction(key, 'readwrite').objectStore(this.key).delete(key)
    );
  }

  get(key: string): Observable<any> {
    return fromPromise(
      this._db.transaction(key, 'readonly').objectStore(this.key).get(key)
    );
  }

  set(key: string, value: any): Observable<void> {
    return fromPromise(
      this._db.transaction(key, 'readwrite').objectStore(this.key).put(key, value)
    ).pipe(mapTo(undefined));
  }

  tx(mode: 'readonly' | 'readwrite' = 'readonly'): Transaction {
    return this._db.transaction(this.key, mode);
  }
}

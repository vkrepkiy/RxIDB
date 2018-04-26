import { Observable } from 'rxjs';
import { map, switchMap, mapTo } from 'rxjs/operators';

import { RxIDB } from './rxidb-db';
import { IRxIDBStore } from './rxidb.interfaces';
import { rxifyRequest, resultFromIDBEvent } from './rxidb-utils';

export class RxIDBStore<TValue extends any, TKey extends IDBValidKey> implements IRxIDBStore {
  constructor(
    public name: string,
    private _db: RxIDB
  ) { }

  public clear(): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map((store) => store.clear()),
      switchMap(req => rxifyRequest(req)),
      mapTo(undefined)
    );
  }

  public delete(key: TKey): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map((store) => store.delete(key)),
      switchMap(req => rxifyRequest(req)),
      mapTo(undefined)
    );
  }

  public get(key: TKey): Observable<any> {
    return this.tx().pipe(
      map((tx) => tx.objectStore(this.name)),
      map(store => store.get(key)),
      switchMap(req => rxifyRequest(req)),
      resultFromIDBEvent
    );
  }

  public set(value: TValue, key?: TKey): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map(store => store.put(value, key)),
      switchMap(req => rxifyRequest(req)),
      mapTo(undefined)
    );
  }

  public tx(mode: 'readonly' | 'readwrite' = 'readonly'): Observable<IDBTransaction> {
    return this._db.tx(this.name, mode);
  }
}

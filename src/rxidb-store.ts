import { Observable, Subject } from 'rxjs';
import { map, switchMap, mapTo, tap, scan, filter, takeUntil, takeWhile, bufferWhen, buffer, take, delay } from 'rxjs/operators';

import { RxIDB } from './rxidb-db';
import { IRxIDBStore } from './rxidb.interfaces';
import { rxifyRequest, resultFromIDBEvent } from './rxidb-utils';

type RxIDBCursorRange = string | number | IDBKeyRange | Date | IDBArrayKey | undefined;

export class RxIDBStore<TValue extends any = any, TKey extends IDBValidKey = IDBValidKey> implements IRxIDBStore {
  private _update$: Subject<void> = new Subject();
  public update$: Observable<any> = this._update$.asObservable();

  constructor(
    public name: string,
    private _db: RxIDB
  ) {}

  public clear(): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map((store) => store.clear()),
      switchMap(req => rxifyRequest(req)),
      tap(() => this._triggerUpdate()),
      mapTo(undefined)
    );
  }

  public cursor(
    mode: 'readonly'|'readwrite' = 'readonly',
    range?: RxIDBCursorRange,
    direction?: IDBCursorDirection
  ): Observable<IDBCursorWithValue> {
    return this.tx(mode).pipe(
      map(tx => tx.objectStore(this.name)),
      map(store => store.openCursor(range, direction)),
      switchMap(req => rxifyRequest(req)),
      resultFromIDBEvent
    );
  }

  public delete(key: TKey): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map((store) => store.delete(key)),
      switchMap(req => rxifyRequest(req)),
      tap(() => this._triggerUpdate()),
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

  public getAll(): Observable<any> {
    let cursor$ = this.cursor();
    let done$   = new Subject();

    return cursor$.pipe(
      tap(cursor => !!cursor ? cursor.continue() : done$.next()),
      filter(cursor => !!cursor),
      map(cursor => cursor.value),
      bufferWhen(() => done$)
    );
  }

  public set(value: TValue, key?: TKey): Observable<any> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map(store => store.put(value, key)),
      switchMap(req => rxifyRequest(req)),
      tap(() => this._triggerUpdate()),
      resultFromIDBEvent
    );
  }

  public tx(mode: 'readonly' | 'readwrite' = 'readonly'): Observable<IDBTransaction> {
    return this._db.tx(this.name, mode);
  }

  /**
   * Trigger update stream
   */
  private _triggerUpdate() {
    this._update$.next();
  }
}

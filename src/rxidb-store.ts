import { Observable, Subject, merge, forkJoin } from 'rxjs';
import { map, switchMap, mapTo, tap, filter, bufferWhen, shareReplay, take } from 'rxjs/operators';

import { RxIDB } from './rxidb-db';
import { IRxIDBStore } from './rxidb.interfaces';
import { rxifyRequest, resultFromIDBEvent } from './rxidb-utils';

export type RxIDBCursorRange = string | number | IDBKeyRange | Date | IDBArrayKey | undefined;

export class RxIDBStore<Model = any> implements IRxIDBStore {
  private _update$: Subject<void> = new Subject();
  public update$: Observable<any> = this._update$.asObservable();

  public data$: Observable<Model[]> = merge(
    this.getAll(),
    this._update$.pipe(switchMap(() => this.getAll()))
  ).pipe(
    shareReplay(1)
  );

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

  public delete(key: IDBValidKey): Observable<void> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      map((store) => store.delete(key)),
      switchMap(req => rxifyRequest(req)),
      tap(() => this._triggerUpdate()),
      mapTo(undefined)
    );
  }

  public reset(collection: any[]): Observable<any> {
    return this.tx('readwrite').pipe(
      map((tx) => tx.objectStore(this.name)),
      switchMap(store => rxifyRequest(store.clear()).pipe(take(1), mapTo(store))),
      map(store => {
        return collection.map(value => {
          return rxifyRequest(store.put(value)).pipe(
            take(1),
            resultFromIDBEvent
          );
        });
      }),
      switchMap((tasks: Observable<any>[]) => forkJoin(tasks)),
      tap(() => this._triggerUpdate())
    );
  }

  public get(key: IDBValidKey): Observable<any> {
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
      bufferWhen(() => done$),
      take(1)
    );
  }

  public set(value: any, key?: IDBValidKey): Observable<any> {
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

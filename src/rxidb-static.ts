import { Observable, forkJoin, Subject, of, Observer } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { RxIDB } from './rxidb-db';
import { RxIDBLayers } from './rxidb.types';
import { RxIDBUpgrade } from './rxidb-upgrade';

export function openDB(dbName: string, dbVersion: number, stores?: RxIDBLayers[]): Observable<RxIDB> {
  let db$: Subject<RxIDB> = new Subject();
  let upgrade$: Subject<void> = new Subject();
  let request: IDBOpenDBRequest = indexedDB.open(dbName, dbVersion);
  let rxIDB: RxIDB;

  request.onerror         = (e: any) => db$.error(e);
  request.onblocked       = (e: any) => db$.error(e);
  request.onsuccess       = (event: any) => {
    rxIDB = rxIDB || new RxIDB(event.target.result);
    db$.next(rxIDB);
    db$.complete();

    if (dbVersion === rxIDB.idb.version) {
      upgrade$.next();
      upgrade$.complete();
    }
  };
  request.onupgradeneeded = (event: any) => {
    rxIDB = rxIDB || new RxIDB(event.target.result);
    onUpgradeEnded(new RxIDBUpgrade(rxIDB, event), stores).subscribe(
      () => upgrade$.next(),
      (e) => upgrade$.error(e),
      () => upgrade$.complete()
    );
  };

  return forkJoin([db$, upgrade$]).pipe(
    map(() => rxIDB)
  );
}

export function onUpgradeEnded(rxIDBUpgrade: RxIDBUpgrade, stores?: RxIDBLayers[]): Observable<any> {
  if (!stores || !stores.length) {
    return of(null);
  }

  return forkJoin(stores.map(layers => setupLayers(rxIDBUpgrade, layers)));
}

export function setupLayers(rxIDBUpgrade: RxIDBUpgrade, layers: RxIDBLayers = new Map()): Observable<any>[] {
  let { oldVersion } = rxIDBUpgrade;
  let observables: Observable<any>[] = [of(true)];

  for (const [layerVersion, layerInstaller] of layers) {
    if (oldVersion < layerVersion) {
      let result = layerInstaller(rxIDBUpgrade);

      if (result instanceof Observable) {
        observables.push(result);
      }
    }
  }

  return observables;
}

export function dropDB(dbName: string): Observable<void> {
  return Observable.create((observer: Observer<void>) => {
    let request = indexedDB.deleteDatabase(dbName);

    request.onblocked = (e) => observer.error(e);
    request.onsuccess = () => observer.next(undefined);
    request.onerror = (e) => observer.error(e);
  }).pipe(take(1));
}

export const rxidb = { openDB, dropDB };

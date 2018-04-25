import { Observable, forkJoin, Subject, from, of, ReplaySubject, throwError } from 'rxjs';
import { take, switchMapTo, map, mapTo, shareReplay, catchError } from 'rxjs/operators';
import idb, { UpgradeDB, DB } from 'idb';

import { RxIDBLayeredUpgrade } from './rxidb.types';
import { RxIDBUpgrade } from './rxidb-upgrade';
import { RxIDB } from './rxidb-db';

export function open(dbName: string, dbVersion: number, upgrades?: RxIDBLayeredUpgrade[]): Observable<RxIDB> {
  return from(idb.open(
    dbName,
    dbVersion,
    (upgradeDB: UpgradeDB) => (upgrades || []).forEach(layers => setupLayers(upgradeDB, layers))
  )).pipe(
    map((db) => new RxIDB(db))
  );
}

export function setupLayers(upgradeDB: UpgradeDB, layers: RxIDBLayeredUpgrade = new Map()): void {
  let { oldVersion } = upgradeDB;
  let rxIDBUpgrade: RxIDBUpgrade = new RxIDBUpgrade(upgradeDB);

  for (const [layerVersion, layerInstaller] of layers) {
    if (oldVersion < layerVersion) {
      layerInstaller(rxIDBUpgrade);
    }
  }
}

export function drop(dbName: string): Observable<void> {
  return from(idb.delete(dbName));
}

export const rxidb = { open, drop };

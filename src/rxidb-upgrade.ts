import { UpgradeDB } from 'idb';
import { Observable, of, Subject } from 'rxjs';

import { RxIDBStoreOptions } from './rxidb.types';
import { RxIDBStore } from './rxidb-store';
import { rxifySync } from './rxidb-utils';
import { IRxIDBUpgrade } from './rxidb.interfaces';

export class RxIDBUpgrade implements IRxIDBUpgrade {
  public get oldVersion(): number {
    return this._upgradeDB.oldVersion;
  }

  public get version(): number {
    return this._upgradeDB.version;
  }

  constructor (
    private _upgradeDB: UpgradeDB
  ) {}

  /**
   * TODO: support options.data
   */
  public create(key: string, options: RxIDBStoreOptions = {}): Observable<void> {
    return rxifySync(() => {
      let store = this._upgradeDB.createObjectStore(key, options);
    });
  }

  public delete(key: string): Observable<void> {
    return rxifySync(() => {
      this._upgradeDB.deleteObjectStore(key);
    });
  }

  public has(key: string): boolean {
    return this._upgradeDB.objectStoreNames.contains(key);
  }
}

import { RxIDB } from './rxidb-db';
import { RxIDBStore } from './rxidb-store';
import { IRxIDBUpgrade } from './rxidb.interfaces';

export class RxIDBUpgradeStore extends RxIDBStore<any, IDBValidKey> {
  constructor(
    private _name: string,
    private _rxidb: RxIDB,
    private _store: IDBObjectStore
  ) {
    super(_name, _rxidb);
  }

  /**
   * Create index
   */
  public createIndex(name: string, keypath: string, params?: IDBIndexParameters): IDBIndex {
    return this._store.createIndex(name, keypath, params);
  }

  /**
   * Fill DB with entries
   */
  public fill(entries: Iterable<any>): this {
    Array.from(entries).forEach(entry => this._store.put(entry));
    return this;
  }
}

export class RxIDBUpgrade implements IRxIDBUpgrade {
  public readonly db: IDBDatabase;
  public readonly oldVersion: number;
  public readonly version: number;

  constructor (
    private _rxidb: RxIDB,
    private _event: any
  ) {
    this.db         = _event.target.result;
    this.oldVersion = _event.oldVersion;
    this.version    = _event.newVersion;
  }

  public create(name: string, options?: IDBObjectStoreParameters): RxIDBUpgradeStore {
    let store = this.db.createObjectStore(name, options);
    return new RxIDBUpgradeStore(name, this._rxidb, store);
  }

  public delete(name: string): void {
    this.db.deleteObjectStore(name);
  }

  public has(name: string): boolean {
    return this.db.objectStoreNames.contains(name);
  }
}

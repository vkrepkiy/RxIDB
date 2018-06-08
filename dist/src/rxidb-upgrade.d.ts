import { RxIDB } from './rxidb-db';
import { RxIDBStore } from './rxidb-store';
import { IRxIDBUpgrade } from './rxidb.interfaces';
export declare class RxIDBUpgradeStore extends RxIDBStore {
    private _store;
    constructor(_name: string, _rxidb: RxIDB, _store: IDBObjectStore);
    /**
     * Create index
     */
    createIndex(name: string, keypath: string, params?: IDBIndexParameters): IDBIndex;
    /**
     * Fill DB with entries
     */
    fill(entries: Iterable<any>): this;
}
export declare class RxIDBUpgrade implements IRxIDBUpgrade {
    private _rxidb;
    readonly db: IDBDatabase;
    readonly oldVersion: number;
    readonly version: number;
    constructor(_rxidb: RxIDB, _event: any);
    create(name: string, options?: IDBObjectStoreParameters): RxIDBUpgradeStore;
    delete(name: string): void;
    has(name: string): boolean;
}

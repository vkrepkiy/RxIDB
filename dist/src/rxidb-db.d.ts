import { Observable } from 'rxjs';
import { IRxIDB } from './rxidb.interfaces';
import { RxIDBStore } from './rxidb-store';
export declare class RxIDB implements IRxIDB {
    readonly idb: IDBDatabase;
    private _storeCache;
    constructor(idb: IDBDatabase);
    /**
     * Close db
     */
    close(): void;
    /**
     * Get store
     */
    get(key: string): RxIDBStore;
    /**
     * Stream: IDBTransaction
     */
    tx(store: string | string[], mode?: 'readonly' | 'readwrite'): Observable<IDBTransaction>;
    /**
     * Open IDBTransaction
     */
    transaction(store: string | string[], mode?: 'readonly' | 'readwrite'): IDBTransaction;
}

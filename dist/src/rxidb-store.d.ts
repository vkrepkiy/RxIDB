import { Observable } from 'rxjs';
import { RxIDB } from './rxidb-db';
import { IRxIDBStore } from './rxidb.interfaces';
export declare type RxIDBCursorRange = string | number | IDBKeyRange | Date | IDBArrayKey | undefined;
export declare class RxIDBStore<Model = any> implements IRxIDBStore {
    name: string;
    private _db;
    private _update$;
    update$: Observable<any>;
    data$: Observable<Model[]>;
    constructor(name: string, _db: RxIDB);
    clear(): Observable<void>;
    cursor(mode?: 'readonly' | 'readwrite', range?: RxIDBCursorRange, direction?: IDBCursorDirection): Observable<IDBCursorWithValue>;
    delete(key: IDBValidKey): Observable<void>;
    reset(collection: any[]): Observable<any>;
    get(key: IDBValidKey): Observable<any>;
    getAll(): Observable<any>;
    set(value: any, key?: IDBValidKey): Observable<any>;
    tx(mode?: 'readonly' | 'readwrite'): Observable<IDBTransaction>;
    /**
     * Trigger update stream
     */
    private _triggerUpdate;
}

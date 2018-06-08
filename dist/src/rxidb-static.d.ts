import { Observable } from 'rxjs';
import { RxIDB } from './rxidb-db';
import { RxIDBLayers } from './rxidb.types';
import { RxIDBUpgrade } from './rxidb-upgrade';
export declare function openDB(dbName: string, dbVersion: number, stores?: RxIDBLayers[]): Observable<RxIDB>;
export declare function onUpgradeEnded(rxIDBUpgrade: RxIDBUpgrade, stores?: RxIDBLayers[]): Observable<any>;
export declare function setupLayers(rxIDBUpgrade: RxIDBUpgrade, layers?: RxIDBLayers): Observable<any>[];
export declare function dropDB(dbName: string): Observable<void>;
export declare const rxidb: {
    openDB: typeof openDB;
    dropDB: typeof dropDB;
};

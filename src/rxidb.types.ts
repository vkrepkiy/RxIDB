import { RxIDBUpgrade } from './rxidb-upgrade';

export type RxIDBLayerInstaller = (db: RxIDBUpgrade) => void;

export type RxIDBLayeredUpgrade = Map<number, RxIDBLayerInstaller>;

export type RxIDBStoreModel = Map<string, any>;

export type RxIDBStoreOptions = IDBObjectStoreParameters;

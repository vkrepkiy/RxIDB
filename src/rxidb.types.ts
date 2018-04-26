import { Observable } from 'rxjs';

import { RxIDBUpgrade } from './rxidb-upgrade';

export type RxIDBLayerInstaller = (db: RxIDBUpgrade) => Observable<any>|void;

export type RxIDBLayers = Map<number, RxIDBLayerInstaller>;

export type RxIDBStoreModel = Map<string, any>;

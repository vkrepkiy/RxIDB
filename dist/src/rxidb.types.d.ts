import { Observable } from 'rxjs';
import { RxIDBUpgrade } from './rxidb-upgrade';
export declare type RxIDBLayerInstaller = (db: RxIDBUpgrade) => Observable<any> | void;
export declare type RxIDBLayers = Map<number, RxIDBLayerInstaller>;
export declare type RxIDBStoreModel = Map<string, any>;

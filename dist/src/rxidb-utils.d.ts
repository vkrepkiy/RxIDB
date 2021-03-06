import { Observable } from 'rxjs';
/**
 * Resolve request as an Observable
 */
export declare function rxifyRequest(request: IDBRequest, successCbs?: any[], errorCbs?: any[]): Observable<any>;
/**
 * Pipe operator for extracting result from idb event
 */
export declare function resultFromIDBEvent(source: Observable<any>): Observable<any>;

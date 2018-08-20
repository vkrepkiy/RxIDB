import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Resolve request as an Observable
 */
export function rxifyRequest(
  request: IDBRequest,
  successCbs: any[] = ['onsuccess'],
  errorCbs: any[] = ['onerror']
): Observable<any> {
  let request$: Subject<any> = new Subject();

  successCbs.forEach(key => request[key] = (e: any) => request$.next(e));
  errorCbs.forEach(key => request[key] = (e: any) => request$.error(e));

  return request$;
}

/**
 * Pipe operator for extracting result from idb event
 */
export function resultFromIDBEvent(source: Observable<any>) {
  return source.pipe(
    map((e: any) => e.target.result)
  );
}

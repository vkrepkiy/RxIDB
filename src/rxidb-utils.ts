import { Subject, Observable, ReplaySubject, Observer } from 'rxjs';
import { take, map } from 'rxjs/operators';

/**
 * Resolve request as an Observable
 */
export function rxifyRequest(request: IDBRequest): Observable<any> {
  let request$: Subject<any> = new Subject();

  request.onerror   = (e: any) => request$.error(e);
  request.onsuccess = (e: any) => request$.next(e);

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

import { Subject, Observable, ReplaySubject, Observer } from 'rxjs';
import { take } from 'rxjs/operators';

export function rxifySync<T>(cb: () => T): Observable<T> {
  return Observable.create((observer: Observer<T>) => {
    try {
      observer.next(cb());
    } catch (e) {
      observer.error(e);
    }

    observer.complete();
  });
}

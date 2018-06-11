import { switchMap, take, tap, takeUntil, retry } from 'rxjs/operators';

import { RxIDB } from '../../src/rxidb-db';
import { openDB, dropDB } from '../../src/rxidb-static';
import { RxIDBLayers } from '../../src/rxidb.types';
import { RxIDBUpgrade } from '../../src/rxidb-upgrade';
import { of, Subject } from 'rxjs';

describe('RxIDB', () => {
  let rxIDB: RxIDB;

  const STORE_NAME = 'Store_1';
  const STORE_KEY  = 'ID';
  const CHECK_KEY  = 'a';
  const ENTRY      = { b: 'b', [STORE_KEY]: CHECK_KEY };

  const LAYERS: RxIDBLayers = new Map([
    [1, (db: RxIDBUpgrade) => {
      db.create(STORE_NAME, {
        keyPath: STORE_KEY,
        autoIncrement: true
      }).fill([
        ENTRY
      ]);
    }]
  ]);

  beforeEach((done) => {
    openDB('DB', 1, [LAYERS]).subscribe((rxidb) => {
      rxIDB = rxidb;
      done();
    }, done);
  });

  afterEach((done) => {
    rxIDB.close();
    rxIDB = null as any;
    dropDB('DB').subscribe(done, done);
  });

  it('is instance of RxIDB' , () => {
    assert.instanceOf(rxIDB, RxIDB);
  });

  it('should have entry from upgrade stage', (done) => {
    let store = rxIDB.get(STORE_NAME);

    store.get(CHECK_KEY).subscribe((val) => {
      expect(val).to.eql(ENTRY);
      done();
    }, done);
  });

  it('can set new entry', (done) => {
    const NEW_KEY = 'new';
    const store = rxIDB.get(STORE_NAME);
    const CHECK_2 = {
      [STORE_KEY]: NEW_KEY,
      'someVal': new Set()
    };

    store.set(CHECK_2).pipe(
      switchMap(() => store.get(NEW_KEY))
    ).subscribe((val) => {
      expect(val).to.eql(CHECK_2);
      done();
    });
  });

  it('can remove entry', (done) => {
    const store = rxIDB.get(STORE_NAME);

    store.get(CHECK_KEY).pipe(
      switchMap(() => store.delete(CHECK_KEY)),
      switchMap(() => store.get(CHECK_KEY))
    ).subscribe((val) => {
      expect(val).to.eq(undefined);
      done();
    });
  });

  it('can get all entries', (done) => {
    const store = rxIDB.get(STORE_NAME);

    store.set(Object.assign({}, ENTRY, { [STORE_KEY]: 'any' })).pipe(
      switchMap(() => store.getAll()),
      take(1)
    ).subscribe(data => {
      assert.isArray(data);
      assert.lengthOf(data, 2);
      done();
    });
  });

  it('Updates data efficiently', (done) => {
    const store = rxIDB.get(STORE_NAME);
    const done$ = new Subject();
    let counter = 0;
    let expected = 0;

    store.data$.pipe(
      takeUntil(done$)
    ).subscribe(() => counter++);

    store.data$.pipe(
      take(1)
    ).subscribe(() => expected++);

    of(null).pipe(
      switchMap(() => {
        expected++;
        return store.set({});
      }),
      switchMap(() => store.data$),
      tap(() => expect(counter).to.eq(expected)),
      retry(7)
    ).subscribe(() => {
      done$.next();
      done();
    }, (e) => done(e));
  });
});

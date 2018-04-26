import { open, drop } from 'rxidb-static';
import { RxIDBLayers } from 'rxidb.types';
import { RxIDBUpgrade } from 'rxidb-upgrade';
import { RxIDBStore } from 'rxidb-store';
import { RxIDB } from 'rxidb-db';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    open('DB', 1, [LAYERS]).subscribe((rxidb) => {
      rxIDB = rxidb;
      done();
    }, done);
  });

  afterEach((done) => {
    rxIDB.close();
    rxIDB = null as any;
    drop('DB').subscribe(done, done);
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
});

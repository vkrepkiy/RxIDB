import { RxIDBStore } from 'rxidb-store';

import { DBMock } from '../support/db.mock';
import { TransactionMock } from '../support/transaction.mock';

const STORE_KEY = 'Store1';

describe('RxIDBStore', () => {
  let store: RxIDBStore;

  beforeEach(() => {
    store = new RxIDBStore(STORE_KEY, (new DBMock() as any));
  });

  it('can open transaction', () => {
    let tx: TransactionMock = store.tx() as any;

    expect(tx.key).to.eq(store.key);
    expect(tx.mode).to.eq('readonly');

    tx = store.tx('readwrite') as any;

    expect(tx.key).to.eq(store.key);
    expect(tx.mode).to.eq('readwrite');
  });

  it('can set value', (done) => {
    const DATA = { a: 1 };
    store.set('key', DATA).subscribe(() => {
      store.get('key').subscribe((data) => {
        expect(data).to.eq(DATA);
        done();
      });
    });
  });
});

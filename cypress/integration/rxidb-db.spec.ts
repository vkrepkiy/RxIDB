import { RxIDB } from 'rxidb-db';
import { RxIDBStore } from 'rxidb-store';

import { DBMock } from '../support/db.mock';
import { TransactionMock } from '../support/transaction.mock';

describe('RxIDB', () => {
  let db: RxIDB;

  beforeEach(() => {
    db = new RxIDB(new DBMock() as any);
  });

  it('should be instanceof RxIDB', () => {
    assert.instanceOf(db, RxIDB);
  });

  it('should be able to open transaction', () => {
    let tx1 = db.transaction('Store1');
    assert.instanceOf(tx1, TransactionMock);

    let tx2 = db.transaction(['Store1']);
    assert.instanceOf(tx2, TransactionMock);
  });

  it('should be able to get storage', () => {
    const STORE_KEY = 'Store1';

    let store1 = db.get(STORE_KEY);

    assert.instanceOf(store1, RxIDBStore);
    expect(store1.key).to.eq(STORE_KEY);
  });
});

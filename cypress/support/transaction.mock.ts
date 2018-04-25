import { StoreMock } from './store.mock';
import { DBMock } from './db.mock';

export class TransactionMock {
  constructor(
    private _db: DBMock,
    public key: string,
    public mode: ('readwrite'|'readonly') = 'readonly'
  ) {}

  public objectStore(key: string) {
    return new StoreMock(this._db, key);
  }
}

import { of } from 'rxjs';
import { TransactionMock } from './transaction.mock';
import { DBMock } from './db.mock';

export class StoreMock {
  constructor (
    private _db: DBMock,
    public key: string
  ) {}

  public get(key: string) {
    return Promise.resolve(this._db.data[key]);
  }

  public put(key: string, value: any) {
    this._db.data[key] = value;

    return Promise.resolve();
  }

  public delete(key: string) {
    delete this._db.data[key];
    return Promise.resolve();
  }

  public tx() {
    return new TransactionMock(this._db, this.key);
  }
}

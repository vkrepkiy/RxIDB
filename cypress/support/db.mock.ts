import { TransactionMock } from './transaction.mock';

export class DBMock {
  public oldVersion: number = 0;

  private _objectStoreNames: string[] = [];

  public data: any = {};

  public objectStoreNames = {
    contains: (key: string) => this._objectStoreNames.indexOf(key) !== -1
  };

  constructor(
    public name: string = 'TestDB',
    public version: number = 1
  ) {}

  public createObjectStore(key: string) {
    this.data[key] = {};
    this._objectStoreNames.push(key);
  }

  public deleteObjectStore(key: string) {
    let i = this._objectStoreNames.indexOf(key);

    if (i !== -1) {
      delete this.data[key];
      this._objectStoreNames.splice(i, 1);
    }
  }

  public close() {}

  public transaction(key: string, mode: 'readwrite' | 'readonly' = 'readonly') {
    return new TransactionMock(this, key, mode);
  }

  static TX = TransactionMock;
}

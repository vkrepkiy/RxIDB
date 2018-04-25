export class UpgradeDBMock {
  oldVersion = 0;

  _objectStoreNames: string[] = [];

  objectStoreNames = {
    contains: (key: string) => this._objectStoreNames.indexOf(key) !== -1
  };

  createObjectStore(key: string) {
    this._objectStoreNames.push(key);
  }

  deleteObjectStore(key: string) {
    let i = this._objectStoreNames.indexOf(key);

    if (i !== -1) {
      this._objectStoreNames.splice(i, 1);
    }
  }
}

import { Observable } from 'rxjs';
import { UpgradeDBMock } from '../support/upgradeDB.mock';
import { RxIDBUpgrade } from 'rxidb-upgrade';

describe('RxIDBUpgrade', () => {
  let upgrade: RxIDBUpgrade;

  beforeEach(() => {
    upgrade = new RxIDBUpgrade(new UpgradeDBMock() as any);
  });

  it('shoud be RxIDBUpgrade instance', () => {
    assert.instanceOf(upgrade, RxIDBUpgrade);
  });

  it('should return Observable from create()', (done) => {
    let o$ = upgrade.create('key');
    assert.instanceOf(o$, Observable);
    o$.subscribe(done, done);
  });

  it('should return Observable from delete()', (done) => {
    let o$ = upgrade.delete('key');
    assert.instanceOf(o$, Observable);
    o$.subscribe(done, done);
  });

  it('should return Observable from has()', () => {
    let bool = upgrade.has('key');
    assert.typeOf(bool, 'boolean');
  });
});

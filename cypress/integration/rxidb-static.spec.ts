import { Observable, of } from 'rxjs';
import { UpgradeDB } from 'idb';

import { RxIDB } from 'rxidb-db';
import { setupLayers, rxidb } from 'rxidb-static';
import { RxIDBUpgrade } from 'rxidb-upgrade';
import { RxIDBLayeredUpgrade, RxIDBLayerInstaller } from 'rxidb.types';

import { UpgradeDBMock } from '../support/upgradeDB.mock';

describe('rxidb', () => {
  it('should be able to setup with empty layers Map', () => {
    const upgradeDB: UpgradeDB = (new UpgradeDBMock() as any);

    expect(() => setupLayers(upgradeDB)).not.to.throw();
  });

  it('should be able to setup layers', () => {
    const upgradeDB: UpgradeDB = (new UpgradeDBMock() as any);

    const layers: RxIDBLayeredUpgrade = new Map([
      [0, (dbu: RxIDBUpgrade) => dbu.create('Store1')],
      [2, (dbu: RxIDBUpgrade) => dbu.delete('Store1')]
    ]);

    expect(() => setupLayers(upgradeDB, layers)).not.to.throw();
  });

  it('should be able to setup layers only from oldVersion', () => {
    const upgradeDB: UpgradeDB = (new UpgradeDBMock() as any);
    (upgradeDB as any).oldVersion = 1;

    let spy1: any = cy.spy().as('Layer 1');
    let spy3: any  = cy.spy().as('Layer 3');

    const layer1: RxIDBLayerInstaller = (dbu: RxIDBUpgrade) => {
      spy1();
      return of(true);
    };
    const layer3: RxIDBLayerInstaller = (dbu: RxIDBUpgrade) => {
      spy3();
      return of(true);
    };

    const layers: RxIDBLayeredUpgrade = new Map([
      [1, layer1],
      [3, layer3],
      [5, (dbu: RxIDBUpgrade) => dbu.delete('Store1')]
    ]);

    setupLayers(upgradeDB, layers);

    expect(spy1).callCount(0);
    expect(spy3).callCount(1);
  });

  it('should handle errors in installers', () => {
    const upgradeDB: UpgradeDB = (new UpgradeDBMock() as any);

    const layers: RxIDBLayeredUpgrade = new Map([
      [1, () => { throw new Error(); }],
      [5, (dbu: RxIDBUpgrade) => dbu.delete('Store1')]
    ]);

    expect(() => setupLayers(upgradeDB, layers)).to.throw();
  });

  it('should open db and return RxIDB', (done) => {
    rxidb.open('MyDB', 1).subscribe((db) => {
      assert.instanceOf(db, RxIDB);
      done();
    }, done);
  });
});

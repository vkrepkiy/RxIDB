# RxIDB

This repo is "work in progress", so be aware of.

```typescript
  import { openDB } from 'rxidb';

  // Open DB, provide name and db version
  openDB('MyDB', 1, [

    // For each Store you can describe upgrade
    // process as [dbVersion, upgradeInstaller]
    new Map([
      [1, (dbUpgrade) => {
        dbUpgrade
          .create('Store 1', { autoIncrement: true })
          .fill([ ENTRY_1, ENTRY_2 ])
      }],
      [4, (dbUpgrade) => {
        // If you return an Observable, db waits
        // util it emits any value
        return of(SomePromise);
      }]
    ])
  ]).subscribe((rxIDB) => {
    let store = rxIDB.get('Store1');

    // Get value by key
    store.get('key').subscribe();

    // Open transaction for selected store
    store.tx('readwrite').subscribe();

    // Original IDBTransaction accessible with:
    rxIDB.transaction(...);
  });
```

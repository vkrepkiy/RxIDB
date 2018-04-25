import { rxifySync } from 'rxidb-utils';

describe('rxifySync', () => {
  it('should return Observable', (done) => {
    let spy: any = cy.spy();
    rxifySync(spy).subscribe(done, done);
  });

  it('should throw Observable.error if Error is thrown in cb()', (done) => {
    rxifySync(() => {
      throw new Error();
    }).subscribe(
      () => {
        done(new Error('Should throw!'));
      },
      () => {
        done();
      }
    );
  });
});

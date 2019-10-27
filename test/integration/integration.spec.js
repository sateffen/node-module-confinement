import {execFile} from 'child_process';
import {join} from 'path';

describe('Integration', () => {
    it('should fail the "one" project', (done) => {
        const modulePath = join(__dirname, '../projects/one/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "two" project', (done) => {
        const modulePath = join(__dirname, '../projects/two/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "three" project', (done) => {
        const modulePath = join(__dirname, '../projects/three/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should not fail the "four" project', (done) => {
        const modulePath = join(__dirname, '../projects/four/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).toBeNull();

            done();
        });
    });

    it('should not fail the "five" project', (done) => {
        const modulePath = join(__dirname, '../projects/five/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).toBeNull();

            done();
        });
    });
});

import {execFile} from 'child_process';
import {join} from 'path';

describe('Confinement', () => {
    it('should fail the "01" project', (done) => {
        const modulePath = join(__dirname, '../projects/confinements/01/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "02" project', (done) => {
        const modulePath = join(__dirname, '../projects/confinements/02/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "03" project', (done) => {
        const modulePath = join(__dirname, '../projects/confinements/03/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should not fail the "04" project', (done) => {
        const modulePath = join(__dirname, '../projects/confinements/04/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).toBeNull();

            done();
        });
    });

    it('should not fail the "05" project', (done) => {
        const modulePath = join(__dirname, '../projects/confinements/05/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).toBeNull();

            done();
        });
    });
});

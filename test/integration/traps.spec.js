import {execFile} from 'child_process';
import {join} from 'path';

describe('Trap', () => {
    it('should fail the "eval" project', (done) => {
        const modulePath = join(__dirname, '../projects/traps/eval/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "function1" project', (done) => {
        const modulePath = join(__dirname, '../projects/traps/function1/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });

    it('should fail the "function2" project', (done) => {
        const modulePath = join(__dirname, '../projects/traps/function2/first.js');

        execFile('node', [modulePath], (aError) => {
            expect(aError).not.toBeNull();

            done();
        });
    });
});

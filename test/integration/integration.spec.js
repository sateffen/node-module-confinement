const childProcess = require('child_process');
const path = require('path');

describe('Integration tests', () => {
    describe('Global confinement', () => {
        test('It should allow internal modules if they are whitelisted', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'globalconfinement/allowinternalmodulebywhitelist.js')], (aError) => {
                expect(aError).toBeNull();
                done();
            });
        });

        test('It should throw an error blocking external nodules by blacklist', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'globalconfinement/failexternalmodulebyplacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should throw an error blocking internal nodules by blacklist', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'globalconfinement/failinternalmodulebyblacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should throw an error blocking internal nodules by policy', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'globalconfinement/failinternalmodulebypolicy.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should fail for blacklisted modules', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'globalconfinement/failrelativemodulebyblacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });
    });

    describe('Local confinement', () => {
        test('It should allow internal modules if they are whitelisted', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/allowinternalmodulebywhitelist.js')], (aError) => {
                expect(aError).toBeNull();
                done();
            });
        });

        test('It should allow module loading if no parent confinements should get evaluated', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/allowallowedinternalmodulebytree.js')], (aError) => {
                expect(aError).toBeNull();
                done();
            });
        });

        test('It should throw an error when violating a parent confinement in a confinement tree', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/failallowedinternalmodulebytree.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should throw an error blocking external nodules by blacklist', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/failexternalmodulebyplacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should throw an error blocking internal nodules by blacklist', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/failinternalmodulebyblacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should throw an error blocking internal nodules by policy', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/failinternalmodulebypolicy.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });

        test('It should fail for blacklisted modules', (done) => {
            childProcess.execFile('node', [path.join(__dirname, 'localconfinements/failrelativemodulebyblacklist.js')], (aError) => {
                expect(aError).not.toBeNull();
                done();
            });
        });
    });
});

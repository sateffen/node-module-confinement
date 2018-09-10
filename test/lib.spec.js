jest.mock('../src/require');

const NodeModule = require('module');
const lib = require('../src/lib');
const {patchRequire} = require('../src/require');

const originalRequire = NodeModule.prototype.require;

describe('lib', () => {
    test('it should patch the global require imediatly', () => {
        expect(patchRequire).toHaveBeenCalledTimes(1);
    });

    describe('lib.installGeneralConfinement', () => {
        const requireBeforeManipulating = NodeModule.prototype.require;

        beforeAll(() => {
            lib.installGeneralConfinement({});
        });

        afterAll(() => {
            NodeModule.prototype.require = originalRequire;
        });

        test('It should throw an error calling installGeneralConfinement twice', () => {
            const testFunction = () => {
                lib.installGeneralConfinement({});
            };

            expect(testFunction).toThrowError();
        });

        test('It should overwrite the original require method', () => {
            expect(NodeModule.prototype.require).not.toBe(requireBeforeManipulating);
        });
    });

    describe('lib.patchConfinedRequire', () => {
        test('It should add a "confinedRequire" method to NodeModule.prototype', () => {
            expect(NodeModule.prototype.confinedRequire).toBeUndefined();

            lib.patchConfinedRequire();

            expect(NodeModule.prototype.confinedRequire).toBeDefined();
            expect(NodeModule.prototype.confinedRequire).toBeInstanceOf(Function);
        });
    });
});

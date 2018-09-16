jest.mock('../src/require');

const NodeModule = require('module');
const lib = require('../src/lib');
const {patchRequire, confinedRequire} = require('../src/require');

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

        beforeEach(() => {
            confinedRequire.mockReset();
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

        test('It should call through to confinedRequire in replaced require function', () => {
            NodeModule.prototype.require.call(module, 'test');

            expect(confinedRequire).toHaveBeenCalledTimes(1);
            expect(confinedRequire).toHaveBeenCalledWith(expect.anything(), expect.any(Map), expect.any(Function), expect.any(Object), expect.any(String), expect.any(Object));
        });
    });

    describe('lib.patchConfinedRequire', () => {
        beforeEach(() => {
            confinedRequire.mockReset();
        });

        test('It should add a "confinedRequire" method to NodeModule.prototype', () => {
            expect(NodeModule.prototype.confinedRequire).toBeUndefined();

            lib.patchConfinedRequire();

            expect(NodeModule.prototype.confinedRequire).toBeDefined();
            expect(NodeModule.prototype.confinedRequire).toBeInstanceOf(Function);
        });

        test('It should call through to confinedRequire in NodeModule.prototype.confinedRequire function', () => {
            NodeModule.prototype.confinedRequire.call(module, 'test', {});

            expect(confinedRequire).toHaveBeenCalledTimes(1);
            expect(confinedRequire).toHaveBeenCalledWith(expect.anything(), expect.any(Map), expect.any(Function), expect.any(Object), expect.any(String), expect.any(Object));
        });
    });
});

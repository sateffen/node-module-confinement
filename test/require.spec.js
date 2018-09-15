jest.mock('../src/utils');

const NodeModule = require('module');
const {patchRequire} = require('../src/require');

const utils = require('../src/utils');

const originalRequire = NodeModule.prototype.require;
const confinementSymbol = Symbol('confinement-test-symbol');

describe('require', () => {
    describe('patchRequire', () => {
        afterEach(() => {
            NodeModule.prototype.require = originalRequire;
        });

        test('It should not throw', () => {
            const functionToTest = (confinementSymbol) => patchRequire(confinementSymbol, new Map());

            expect(functionToTest).not.toThrow();
        });

        test('It should override the require method with a new one', () => {
            patchRequire(confinementSymbol, new Map());

            expect(NodeModule.prototype.require).not.toBe(originalRequire);
        });
    });

    describe('patchRequire patched require version', () => {
        let requireMock = null;
        let futureConfinedModulesMap = null;

        beforeEach(() => {
            futureConfinedModulesMap = new Map();
            module[confinementSymbol] = undefined;
            requireMock = jest.fn();
            NodeModule.prototype.require = requireMock;
            patchRequire(confinementSymbol, futureConfinedModulesMap);
        });

        afterEach(() => {
            NodeModule.prototype.require = originalRequire;
        });

        test('It should call through to require if no confinement is found', () => {
            const mockReturn = Math.random().toString(36);
            requireMock.mockReturnValue(mockReturn);
            const returnValue = NodeModule.prototype.require.call(module, 'my-test-module');

            expect(returnValue).toBe(mockReturn);
            expect(utils.isAllowedToCall).not.toHaveBeenCalled();
        });

        test('It should evaluate the confinement if found by calling isAllowedToCall with it', () => {
            const confinement = {};
            module[confinementSymbol] = confinement;
            const moduleName = 'my-test-module';
            utils.isAllowedToCall.mockReturnValue(true);

            NodeModule.prototype.require.call(module, moduleName);

            expect(utils.isAllowedToCall).toHaveBeenCalledWith(confinement, moduleName);
        });

        test('It should throw an error if the confinement forbids loading the module', () => {
            const confinement = {};
            module[confinementSymbol] = confinement;
            const moduleName = 'my-test-module';
            utils.isAllowedToCall.mockReturnValue(false);

            const callRequire = () => NodeModule.prototype.require.call(module, moduleName);

            expect(callRequire).toThrow();
        });
    });
});

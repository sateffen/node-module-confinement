jest.mock('../src/utils');

const NodeModule = require('module');
const {patchRequire, confinedRequire} = require('../src/require');

const ModuleConfinement = require('../src/moduleconfinement');
const utils = require('../src/utils');

const originalRequire = NodeModule.prototype.require;
const originalNodeModuleResolveFilename = NodeModule._resolveFilename;
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
        const requireMock = jest.fn();
        const futureConfinedModulesMap = new Map();

        beforeEach(() => {
            futureConfinedModulesMap.clear();
            requireMock.mockReset();
            module[confinementSymbol] = undefined;
            NodeModule.prototype.require = requireMock;
            patchRequire(confinementSymbol, futureConfinedModulesMap);
        });

        afterEach(() => {
            NodeModule.prototype.require = originalRequire;
        });

        test('It should call through to require if no confinement is found', () => {
            const mockReturn = Math.random().toString(36);
            requireMock.mockReturnValue(mockReturn);
            const returnValue = NodeModule.prototype.require.call(module, 'jest');

            expect(returnValue).toBe(mockReturn);
            expect(utils.isAllowedToCall).not.toHaveBeenCalled();
        });

        test('It should evaluate the confinement if found by calling isAllowedToCall with it', () => {
            const confinement = {};
            module[confinementSymbol] = confinement;
            const moduleName = 'jest';
            const resolvedFilename = NodeModule._resolveFilename(moduleName, module, false);
            utils.isAllowedToCall.mockReturnValue(true);

            NodeModule.prototype.require.call(module, moduleName);

            expect(utils.isAllowedToCall).toHaveBeenCalledWith(confinement, resolvedFilename);
        });

        test('It should throw an error if the confinement forbids loading the module', () => {
            const confinement = {};
            module[confinementSymbol] = confinement;
            const moduleName = 'jest';
            utils.isAllowedToCall.mockReturnValue(false);

            const callRequire = () => NodeModule.prototype.require.call(module, moduleName);

            expect(callRequire).toThrow();
        });

        test('It should evaluate the confinement found in the starting up modules map by calling isAllowedToCall with it', () => {
            const confinement = {};
            futureConfinedModulesMap.set(module.id, confinement);
            const moduleName = 'jest';
            const resolvedFilename = NodeModule._resolveFilename(moduleName, module, false);
            utils.isAllowedToCall.mockReturnValue(true);

            NodeModule.prototype.require.call(module, moduleName);

            expect(utils.isAllowedToCall).toHaveBeenCalledWith(confinement, resolvedFilename);
        });

        test('It should throw an error if the confinement found in the starting up modules map forbids loading the module', () => {
            const confinement = {};
            futureConfinedModulesMap.set(module.id, confinement);
            const moduleName = 'jest';
            utils.isAllowedToCall.mockReturnValue(false);

            const callRequire = () => NodeModule.prototype.require.call(module, moduleName);

            expect(callRequire).toThrow();
        });
    });

    describe('confinedRequire', () => {
        const futureConfinedModulesMap = new Map();
        const futureConfinedModulesMapSetSpy = jest.spyOn(futureConfinedModulesMap, 'set');
        const futureConfinedModulesMapDeleteSpy = jest.spyOn(futureConfinedModulesMap, 'delete');
        const boundConfinedRequire = confinedRequire.bind(null, confinementSymbol, futureConfinedModulesMap);
        const requireFunction = {call: jest.fn()};

        beforeEach(() => {
            futureConfinedModulesMap.clear();
            requireFunction.call.mockReset();
            futureConfinedModulesMapSetSpy.mockReset();
            futureConfinedModulesMapDeleteSpy.mockReset();
            NodeModule._resolveFilename = jest.fn();
            NodeModule._resolveFilename.mockReturnValue('');
            NodeModule._cache[''] = {};
        });

        afterEach(() => {
            NodeModule._resolveFilename = originalNodeModuleResolveFilename;
            NodeModule._cache[''] = undefined;
        });

        test('It should call require directly when passing an internal module', () => {
            boundConfinedRequire(requireFunction, {}, 'fs', {});

            expect(requireFunction.call).toHaveBeenCalledTimes(1);
        });

        test('It should return the return value of require for internal modules', () => {
            const moduleInstance = {myModule: true};
            requireFunction.call.mockReturnValue(moduleInstance);

            const returnValue = boundConfinedRequire(requireFunction, {}, 'fs', {});

            expect(returnValue).toBe(moduleInstance);
        });

        test('It should pass the correct this-context and module-name to require function', () => {
            const thisContext = {thisContext: true};
            const moduleName = 'fs';

            boundConfinedRequire(requireFunction, thisContext, 'fs', {});

            expect(requireFunction.call).toHaveBeenCalledWith(thisContext, moduleName);
        });

        test('It should resolve the filename with the NodeModule method', () => {
            const resolvedFilename = Math.random().toString(36);
            const moduleName = Math.random().toString(36);
            const thisContext = {};
            NodeModule._resolveFilename.mockReturnValue(resolvedFilename);
            NodeModule._cache[resolvedFilename] = {};

            boundConfinedRequire(requireFunction, thisContext, moduleName, {});

            expect(NodeModule._resolveFilename).toHaveBeenCalledTimes(1);
            expect(NodeModule._resolveFilename).toHaveBeenCalledWith(moduleName, thisContext, false);

            NodeModule._cache[resolvedFilename] = undefined;
        });

        test('It should set the confinement to the startup map for external modules', () => {
            const resolvedFilename = 'module-to-set';
            const thisContext = {};
            const confinement = {allowInternalModules: true};
            const resultingModuleConfinement = new ModuleConfinement(confinement, module);
            NodeModule._resolveFilename.mockReturnValue(resolvedFilename);
            NodeModule._cache[resolvedFilename] = {};

            boundConfinedRequire(requireFunction, thisContext, 'test', confinement);

            expect(futureConfinedModulesMapSetSpy).toHaveBeenCalledTimes(1);
            expect(futureConfinedModulesMapSetSpy).toHaveBeenCalledWith(resolvedFilename, expect.objectContaining(resultingModuleConfinement));

            NodeModule._cache[resolvedFilename] = undefined;
        });

        test('It should delete the confinement to the startup map for external modules to clean up', () => {
            const resolvedFilename = 'module-to-delete';
            NodeModule._resolveFilename.mockReturnValue(resolvedFilename);
            NodeModule._cache[resolvedFilename] = {};

            boundConfinedRequire(requireFunction, {}, 'test', {});

            expect(futureConfinedModulesMapDeleteSpy).toHaveBeenCalledTimes(1);
            expect(futureConfinedModulesMapDeleteSpy).toHaveBeenCalledWith(resolvedFilename);

            NodeModule._cache[resolvedFilename] = undefined;
        });

        test('It should add the confinementdefinition to the module instance in cache', () => {
            const resolvedFilename = 'module-to-patch';
            const confinement = {allowInternalModules: true};
            const resultingModuleConfinement = new ModuleConfinement(confinement, module);
            NodeModule._resolveFilename.mockReturnValue(resolvedFilename);
            NodeModule._cache[resolvedFilename] = {};

            boundConfinedRequire(requireFunction, {}, 'test', confinement);

            expect(NodeModule._cache[resolvedFilename][confinementSymbol]).toEqual(resultingModuleConfinement);

            NodeModule._cache[resolvedFilename] = undefined;
        });
    });
});

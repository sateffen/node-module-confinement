const NodeModule = require('module');
const ModuleConfinement = require('../../src/moduleconfinement');
const utils = require('../../src/utils');

describe('utils', () => {
    describe('isAllowedToCall', () => {
        const trueForInternalModules = new ModuleConfinement({allowInternalModules: true}, module);
        const falseForInternalModules = new ModuleConfinement({allowInternalModules: false}, module);
        const testInternalModules = test.each(NodeModule.builtinModules);

        testInternalModules('It should return true if internal modules are not allowed when asking for "%s"', (aModuleName) => {
            const resolvedModule = NodeModule._resolveFilename(aModuleName, module, false);
            const returnValue = utils.isAllowedToCall(trueForInternalModules, resolvedModule);

            expect(returnValue).toBe(true);
        });

        testInternalModules('It should return false if internal modules are not allowed when asking for "%s"', (aModuleName) => {
            const resolvedModule = NodeModule._resolveFilename(aModuleName, module, false);
            const returnValue = utils.isAllowedToCall(falseForInternalModules, resolvedModule);

            expect(returnValue).toBe(false);
        });

        test('It should allow an internal module if it is whiteListed', () => {
            const moduleToAllow = 'path';
            const moduleConfinement = new ModuleConfinement({allowInternalModules: false, whiteList: [moduleToAllow]}, module);
            const resolvedModule = NodeModule._resolveFilename(moduleToAllow, module, false);
            const returnValue = utils.isAllowedToCall(moduleConfinement, resolvedModule);

            expect(returnValue).toBe(true);
        });

        test('It should allow whitelisted modules even if they are blacklisted', () => {
            const moduleToAllow = 'jest';
            const moduleConfinement = new ModuleConfinement({blackList: [moduleToAllow], whiteList: [moduleToAllow]}, module);
            const resolvedModule = NodeModule._resolveFilename(moduleToAllow, module, false);
            const returnValue = utils.isAllowedToCall(moduleConfinement, resolvedModule);

            expect(returnValue).toBe(true);
        });

        test('It should disallow blacklisted modules', () => {
            const moduleToAllow = 'jest';
            const moduleConfinement = new ModuleConfinement({blackList: [moduleToAllow]}, module);
            const resolvedModule = NodeModule._resolveFilename(moduleToAllow, module, false);
            const returnValue = utils.isAllowedToCall(moduleConfinement, resolvedModule);

            expect(returnValue).toBe(false);
        });
    });
});

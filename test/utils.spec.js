const NodeModule = require('module');
const ModuleConfinement = require('../src/moduleconfinement');
const utils = require('../src/utils');

describe('utils', () => {
    describe('isAllowedToCall', () => {
        const trueForInternalModules = new ModuleConfinement({allowInternalModules: true});
        const falseForInternalModules = new ModuleConfinement({allowInternalModules: false});
        const testInternalModules = test.each(NodeModule.builtinModules);

        testInternalModules('It should return true if internal modules are not allowed when asking for "%s"', (aModuleName) => {
            const returnValue = utils.isAllowedToCall(trueForInternalModules, aModuleName);

            expect(returnValue).toBe(true);
        });

        testInternalModules('It should return false if internal modules are not allowed when asking for "%s"', (aModuleName) => {
            const returnValue = utils.isAllowedToCall(falseForInternalModules, aModuleName);

            expect(returnValue).toBe(false);
        });

        test('It should allow an internal module if it is whiteListed', () => {
            const moduleToAllow = 'path';
            const moduleConfinement = new ModuleConfinement({allowInternalModules: false, whiteList: [moduleToAllow]});
            const returnValue = utils.isAllowedToCall(moduleConfinement, moduleToAllow);

            expect(returnValue).toBe(true);
        });

        test('It should allow whitelisted modules even if they are blacklisted', () => {
            const moduleToAllow = 'lodash';
            const moduleConfinement = new ModuleConfinement({blackList: [moduleToAllow], whiteList: [moduleToAllow]});
            const returnValue = utils.isAllowedToCall(moduleConfinement, moduleToAllow);

            expect(returnValue).toBe(true);
        });

        test('It should disallow blacklisted modules', () => {
            const moduleToAllow = 'lodash';
            const moduleConfinement = new ModuleConfinement({blackList: [moduleToAllow]});
            const returnValue = utils.isAllowedToCall(moduleConfinement, moduleToAllow);

            expect(returnValue).toBe(false);
        });
    });
});

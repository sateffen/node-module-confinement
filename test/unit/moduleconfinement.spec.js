const NodeModule = require('module');
const ModuleConfinement = require('../../src/moduleconfinement');

describe('ModuleConfinement', () => {
    test('The constructor should not throw when no argument is given', () => {
        const construct = () => new ModuleConfinement();

        expect(construct).not.toThrow();
    });

    test('The constructor should not throw when an empty object is given', () => {
        const construct = () => new ModuleConfinement({});

        expect(construct).not.toThrow();
    });

    test('The initial value for "allowInternalModules" should be false', () => {
        const instance = new ModuleConfinement();

        expect(instance.allowInternalModules).toBe(false);
    });

    test('The initial value for "blackList" should be an empty array', () => {
        const instance = new ModuleConfinement();

        expect(instance.blackList).toEqual([]);
    });

    test('The initial value for "whiteList" should be an empty array', () => {
        const instance = new ModuleConfinement();

        expect(instance.whiteList).toEqual([]);
    });

    test('The constructor should evaluate the initial value for "allowInternalModules" correctly', () => {
        const config = {allowInternalModules: true};
        const instance = new ModuleConfinement(config, module);

        expect(instance.allowInternalModules).toBe(config.allowInternalModules);
    });

    test('The constructor should evaluate the initial value for "blackList" correctly', () => {
        const config = {blackList: ['jest']};
        const instance = new ModuleConfinement(config, module);
        const correctBlackList = [NodeModule._resolveFilename('jest', module, false)];

        expect(instance.blackList).toEqual(correctBlackList);
    });

    test('The constructor should evaluate the initial value for "whiteList" correctly', () => {
        const config = {whiteList: ['jest']};
        const instance = new ModuleConfinement(config, module);
        const correctWhiteList = [NodeModule._resolveFilename('jest', module, false)];

        expect(instance.whiteList).toEqual(correctWhiteList);
    });
});

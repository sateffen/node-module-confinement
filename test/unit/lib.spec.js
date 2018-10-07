jest.mock('../../src/setup');
const setup = require('../../src/setup');

const configure = require('../../src/lib');

describe('lib', () => {
    const generalConfinement = {};
    const patchWithConfinedRequire = true;
    const useRecursiveConfinement = true;
    const resultingConfiguration = {
        generalConfinement,
        patchWithConfinedRequire,
        useRecursiveConfinement,
    };

    beforeAll(() => {
        configure(resultingConfiguration);
    });

    test('It should throw an error calling configure a second time', () => {
        const testFunction = () => configure(resultingConfiguration);

        expect(testFunction).toThrow();
    });

    test('It should call setup.installGeneralConfinement with the passed general confinement', () => {
        expect(setup.installGeneralConfinement).toHaveBeenCalledTimes(1);
        expect(setup.installGeneralConfinement).toHaveBeenCalledWith(generalConfinement);
    });

    test('It should call setup.patchConfinedRequire', () => {
        expect(setup.patchConfinedRequire).toHaveBeenCalledTimes(1);
    });

    test('It should call setup.init with the passed configuration', () => {
        expect(setup.init).toHaveBeenCalledTimes(1);
        expect(setup.init).toHaveBeenCalledWith(resultingConfiguration);
    });
});

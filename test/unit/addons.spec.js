import * as addons from '../../src/addons';

describe('addons.js', () => {
    describe('installTrapFunctionAddon', () => {
        let spy = null;

        beforeEach(() => {
            spy = jest.spyOn(global, 'Function');
        });

        it('should overwrite global.Function', () => {
            addons.installTrapFunctionAddon();

            expect(spy).not.toBe(global.Function);
        });

        it('should throw an error calling the trapped function instead of calling through', () => {
            const callback = () => global.Function('console.log("bad stuff!");')();

            addons.installTrapFunctionAddon();

            expect(callback).toThrow();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should throw an error constructing the trapped constructor instead of calling through', () => {
            const callback = () => new global.Function('console.log("bad stuff!");')();

            addons.installTrapFunctionAddon();

            expect(callback).toThrow();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('installTrapEvalAddon', () => {
        let spy = null;

        beforeEach(() => {
            spy = jest.spyOn(global, 'eval');
        });

        it('should overwrite global.eval', () => {
            addons.installTrapEvalAddon();

            expect(spy).not.toBe(global.eval);
        });

        it('should throw an error calling the trapped function instead of calling through', () => {
            const callback = () => global.eval('console.log("bad stuff!");');

            addons.installTrapEvalAddon();

            expect(callback).toThrow();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});

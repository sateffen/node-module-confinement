import {isBoolean, isNodeModule, isObject, Cell} from '../../src/utils';

describe('utils.js', () => {
    describe('isBoolean', () => {
        const booleanTypes = [true, false];
        const nonBooleanTypes = [undefined, null, 'test', 0, 1, 2, 3.14, -4, -5.5, [], {}, () => {}];

        booleanTypes.forEach((aData) => {
            it(`should return "true" for "${aData}" (type: "${toString.call(aData)}")`, () => {
                expect(isBoolean(aData)).toBe(true);
            });
        });

        nonBooleanTypes.forEach((aData) => {
            it(`should return "false" for "${aData}" (type: "${toString.call(aData)}")`, () => {
                expect(isBoolean(aData)).toBe(false);
            });
        });
    });

    describe('isNodeModule', () => {
        const nonNodeModuleTypes = [true, false, undefined, null, 'test', 0, 1, 2, 3.14, -4, -5.5, [], {}, () => {}];

        xit('should return "true" for a node-module instance', () => {
            expect(isNodeModule(module)).toBe(true);
        });

        nonNodeModuleTypes.forEach((aData) => {
            it(`should return "false" for "${aData}" (type: "${toString.call(aData)}")`, () => {
                expect(isNodeModule(aData)).toBe(false);
            });
        });
    });

    describe('isObject', () => {
        const nonObjectTypes = [true, false, undefined, null, 'test', 0, 1, 2, 3.14, -4, -5.5, [], () => {}];

        it('should return "true" for an object', () => {
            expect(isObject({})).toBe(true);
        });

        nonObjectTypes.forEach((aData) => {
            it(`should return "false" for "${aData}" (type: "${toString.call(aData)}")`, () => {
                expect(isObject(aData)).toBe(false);
            });
        });
    });

    describe('Cell', () => {
        it('should not throw an error when constructed', () => {
            const callback = () => new Cell();

            expect(callback).not.toThrow();
        });

        it('should write the value to the cell when calling "cell.set"', () => {
            const cell = new Cell();
            const dataToSet = Math.random().toString(36);

            cell.set(dataToSet);

            expect(cell._data).toBe(dataToSet);
        });

        it('should read the value in the cell when calling "cell.get"', () => {
            const cell = new Cell();
            const dataToGet = Math.random().toString(36);

            cell._data = dataToGet;

            expect(cell.get()).toBe(dataToGet);
        });
    });
});

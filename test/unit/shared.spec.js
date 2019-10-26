import {rootModuleCell, defaultConfinementCell, confinementsMap} from '../../src/shared';
import {Cell} from '../../src/utils';

describe('shared.js', () => {
    it('should have a value called "rootModuleCell"', () => {
        expect(rootModuleCell).toBeDefined();
    });

    it('should have "rootModuleCell" as instance of "Cell"', () => {
        expect(rootModuleCell).toBeInstanceOf(Cell);
    });

    it('should have a value called "defaultConfinementCell"', () => {
        expect(defaultConfinementCell).toBeDefined();
    });

    it('should have "defaultConfinementCell" as instance of "Cell"', () => {
        expect(defaultConfinementCell).toBeInstanceOf(Cell);
    });

    it('should have a value called "confinementsMap"', () => {
        expect(confinementsMap).toBeDefined();
    });

    it('should have "confinementsMap" as instance of "Map"', () => {
        expect(confinementsMap).toBeInstanceOf(Map);
    });
});

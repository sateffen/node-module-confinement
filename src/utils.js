import * as NodeModule from 'node:module';

/**
 * Checks whether given data is a boolean
 * @param {any} aData The data to examine
 * @return {boolean} The result
 */
export function isBoolean(aData) {
    return typeof aData === 'boolean';
}

/**
 * Checks whether given data is an object
 * @param {any} aData The data to examine
 * @return {boolean} The result
 */
export function isObject(aData) {
    return typeof aData === 'object' && aData !== null && !Array.isArray(aData);
}

/**
 * Checks whether given data is a node-module
 * @param {any} aData The data to examine
 * @return {boolean} The result
 */
export function isNodeModule(aData) {
    return aData instanceof NodeModule.Module;
}

/**
 * A simple helper class, that acts as data cell
 */
export class Cell {
    /**
     * The constructor
     */
    constructor() {
        this._data = null;
    }

    /**
     * Returns the content of the cell
     * @return {any} The cell data
     */
    get() {
        return this._data;
    }

    /**
     * Writes given data to the cell
     * @param {any} aNewData The data to write
     */
    set(aNewData) {
        this._data = aNewData;
    }
}

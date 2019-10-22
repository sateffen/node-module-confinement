import {Cell} from './utils';

/**
 * The root module
 * @type {Cell<NodeModule>}
 */
export const rootModuleCell = new Cell();

/**
 * The default confinement
 * @type {Cell<ModuleConfinement>}
 */
export const defaultConfinementCell = new Cell();

/**
 * The specific module confintments
 * @type {Map<string, ModuleConfinement>}
 */
export const confinementsMap = new Map();

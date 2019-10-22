import * as NodeModule from 'module';
import {ModuleConfinement} from './moduleconfinement';
import {installRequireProxy} from './requireproxy';
import {confinementsMap, defaultConfinementCell, rootModuleCell} from './shared';
import {installAddons} from './addons';
import {isObject, isNodeModule} from './utils';

/**
 * @typedef RawModuleConfinement
 * @property {boolean} [allowBuiltIns=true]
 * @property {boolean} [applyToChildren=false]
 * @property {Array<string>} [whiteList=[]]
 * @property {Array<string>} [blackList=[]]
 * @property {Object} [redirect={}]
 */

/**
 * @typedef AddonsConfig
 * @property {boolean} [trapEval=false]
 * @property {boolean} [trapFunction=false]
 * @property {boolean} [freezeModules=false]
 */

/**
 * @typedef NodeModuleConfinementOptions
 * @property {RawModuleConfinement} [defaultConfinement={}]
 * @property {Object} [confinements={}]
 * @property {AddonsConfig} [addons={}]
 */

/**
 * Configures all confinements
 * @param {NodeModule} aRootModule
 * @param {NodeModuleConfinementOptions} aOptions
 */
function setup(aRootModule, aOptions) {
    // first validate the given arguments
    if (!isNodeModule(aRootModule)) {
        throw new TypeError(`NodeModuleConfinement configure: First parameter needs to be an instance of NodeModule`);
    }
    else if (!isObject(aOptions)) {
        throw new TypeError(`NodeModuleConfinement configure: Second parameter needs to be an object, got ${typeof aOptions}`);
    }

    // then write all option data to the shared references
    rootModuleCell.set(aRootModule);

    if (isObject(aOptions.defaultConfinement)) {
        defaultConfinementCell.set(new ModuleConfinement(aOptions.defaultConfinement, aRootModule));
    }
    else {
        defaultConfinementCell.set(new ModuleConfinement({}, aRootModule));
    }

    if (isObject(aOptions.confinements)) {
        const keys = Object.keys(aOptions.confinements);

        for (let i = 0, iLen = keys.length; i < iLen; i++) {
            const targetModule = NodeModule._resolveFilename(keys[i], aRootModule, false);
            const confinement = new ModuleConfinement(aOptions.confinements[keys[i]], aRootModule);

            confinementsMap.set(targetModule, confinement);
        }
    }

    // if any traps should get installed, call the trap installer
    if (isObject(aOptions.addons)) {
        installAddons(aOptions.addons);
    }

    // Then install the require proxy, that actually prevents bad things from happening
    installRequireProxy();
}

module.exports.setup = setup;

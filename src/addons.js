import * as NodeModule from 'module';

/**
 * Installs a trap for global.Function, to prevent usage of that
 */
function installTrapFunctionAddon() {
    global.Function = new Proxy(global.Function, {
        construct() {
            throw new Error('NodeModuleConfinement: Found call of "new Function()", which is not allowed.');
        },
        apply() {
            throw new Error('NodeModuleConfinement: Found call of "Function()", which is not allowed.');
        },
    });
}

/**
 * Installs a trap for global.eval, to prevent usage of that
 */
function installTrapEvalAddon() {
    global.eval = new Proxy(global.eval, {
        apply() {
            throw new Error('NodeModuleConfinement: Found call of "eval()", which is not allowed.');
        },
    });
}

/**
 * Installs a proxy for freezing modules, to prevent patching modules unexpectedly
 */
function installFreezeModuleAddon() {
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            return Object.freeze(Reflect.apply(aTarget, aThisContext, aArgumentsList));
        },
    });
}

/**
 * Installs all traps referenced by the options
 * @param {AddonsConfig} aOptions
 */
export function installAddons(aOptions) {
    if (aOptions.trapEval === true) {
        installTrapEvalAddon();
    }

    if (aOptions.trapFunction === true) {
        installTrapFunctionAddon();
    }

    if (aOptions.freezeModules === true) {
        installFreezeModuleAddon();
    }
}

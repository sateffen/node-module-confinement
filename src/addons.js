/**
 * Installs a trap for global.Function, to prevent usage of that
 */
export function installTrapFunctionAddon() {
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
export function installTrapEvalAddon() {
    global.eval = new Proxy(global.eval, {
        apply() {
            throw new Error('NodeModuleConfinement: Found call of "eval()", which is not allowed.');
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
}

const NodeModule = require('module');
const {isAllowedToCall} = require('./utils');
const ModuleConfinement = require('./moduleconfinement');

/**
 * Patches the require function with a confinement checking one
 * @param {Symbol} aConfinementSymbol The confinement symbol to use
 * @param {Map<string, ModuleConfinement>} aModulesInStartUpMap
 */
function patchRequire(aConfinementSymbol, aModulesInStartUpMap) {
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            const moduleToLoad = NodeModule._resolveFilename(aArgumentsList[0], aThisContext, false);
            let confinementDefinition = null;
            let confinementDefinitionSource = null;

            if (aModulesInStartUpMap.has(aThisContext.id)) {
                confinementDefinition = aModulesInStartUpMap.get(aThisContext.id);
                confinementDefinitionSource = aThisContext.id;
            }
            else {
                let confinedModule = aThisContext;

                while (confinedModule && !confinedModule[aConfinementSymbol]) {
                    confinedModule = confinedModule.parent;
                }

                if (confinedModule) {
                    confinementDefinition = confinedModule[aConfinementSymbol];
                    confinementDefinitionSource = confinedModule.id;
                }
            }

            if (confinementDefinition && !isAllowedToCall(confinementDefinition, moduleToLoad)) {
                throw new Error(`Module with id "${aThisContext.id}" wants to load forbidden module ${aArgumentsList[0]} (confined by module: ${confinementDefinitionSource})`);
            }

            return Reflect.apply(aTarget, aThisContext, aArgumentsList);
        },
    });
}

/**
 * Loads given module with require, but confined. Can't confine internal modules
 * @param {Symbol} aConfinementDefinitionSymbol The confinement definition symbol
 * @param {Map<string, ModuleConfinement>} aModulesInConfinedStartUp The modules in startup confinement map
 * @param {Function} aRequireFunction The require function to call when calling the native require
 * @param {NodeModule} aThisContext The module context to use
 * @param {string} aModuleToLoad The module to load
 * @param {Object} aConfinementDefinition The temporary confinement to use for the require
 * @return {any} The result of the module
 */
function confinedRequire(aConfinementDefinitionSymbol, aModulesInConfinedStartUp, aRequireFunction, aThisContext, aModuleToLoad, aConfinementDefinition) {
    const isInternalModule = NodeModule.builtinModules.includes(aModuleToLoad);
    let newModule = null;

    if (isInternalModule) {
        newModule = aRequireFunction.call(aThisContext, aModuleToLoad);
    }
    else {
        const newModuleFileKey = NodeModule._resolveFilename(aModuleToLoad, aThisContext, false);
        const confinementDefinition = Object.freeze(new ModuleConfinement(aConfinementDefinition, aThisContext));

        aModulesInConfinedStartUp.set(newModuleFileKey, confinementDefinition);

        newModule = aRequireFunction.call(aThisContext, aModuleToLoad);

        // then we select the real module instance from the module cache
        const newModuleInstance = NodeModule._cache[newModuleFileKey];

        // then we define the property on the real module instance
        Object.defineProperty(newModuleInstance, aConfinementDefinitionSymbol, {
            value: confinementDefinition,
        });

        aModulesInConfinedStartUp.delete(newModuleFileKey);
    }

    return newModule;
}

module.exports = {
    patchRequire,
    confinedRequire,
};

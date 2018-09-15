const NodeModule = require('module');
const {isAllowedToCall} = require('./utils');

/**
 * Patches the require function with a confinement checking one
 * @param {Symbol} aConfinementSymbol The confinement symbol to use
 * @param {Map<string, ModuleConfinement>} aModulesInStartUpMap
 */
function patchRequire(aConfinementSymbol, aModulesInStartUpMap) {
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            const moduleToLoad = aArgumentsList[0];
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
                throw new Error(`Module with id "${aThisContext.id}" wants to load forbidden module ${moduleToLoad} (confined by module: ${confinementDefinitionSource})`);
            }

            return Reflect.apply(aTarget, aThisContext, aArgumentsList);
        },
    });
}

module.exports = {
    patchRequire,
};

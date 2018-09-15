const NodeModule = require('module');
const ModuleConfinement = require('./moduleconfinement');
const {patchRequire} = require('./require');

const confinementDefinitionSymbol = Symbol('node-module-confinement');
const modulesInConfinedStartUp = new Map();
let generalConfinementInstalled = false;

/**
 * Installs a proxy for loading all node-modules in confinements
 * @param {Object} aConfinementConfiguration
 */
function installGeneralConfinement(aConfinementConfiguration) {
    if (generalConfinementInstalled) {
        throw new Error('General confinement already installed, cannot install twice');
    }

    generalConfinementInstalled = true;
    const confinementDefinition = Object.freeze(new ModuleConfinement(aConfinementConfiguration));
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            const isInternalModule = NodeModule.builtinModules.includes(aArgumentsList[0]);
            // but if we reach here, we generate the module file key, which is used in the module cache
            const newModuleFileKey = NodeModule._resolveFilename(aArgumentsList[0], aThisContext, false);
            let newModule = null;

            if (!isInternalModule) {
                modulesInConfinedStartUp.set(newModuleFileKey, confinementDefinition);

                newModule = Reflect.apply(aTarget, aThisContext, aArgumentsList);

                // then we select the real module instance from the module cache
                const newModuleInstance = NodeModule._cache[newModuleFileKey];

                // then we define the property on the real module instance
                Object.defineProperty(newModuleInstance, confinementDefinitionSymbol, {
                    value: confinementDefinition,
                });

                modulesInConfinedStartUp.delete(newModuleFileKey);
            }
            else {
                newModule = Reflect.apply(aTarget, aThisContext, aArgumentsList);
            }

            return newModule;
        },
    });
}

/**
 * Patches the general module prototype with the *confinedRequire* method
 */
function patchConfinedRequire() {
    NodeModule.prototype.confinedRequire = function loadConfinedModule(aModulePath, aConfinementConfiguration) {
        // if the module is a build it, we can't do anything but delegate it to the original require function
        if (NodeModule.builtinModules.includes(aModulePath)) {
            NodeModule.prototype.require.call(this, aModulePath);
        }

        // first determine the file to lad
        const fileToLoad = NodeModule._resolveFilename(aModulePath, this, false);

        // and than instanciate the file
        const newModuleInstance = new NodeModule(aModulePath, this);

        Object.defineProperty(newModuleInstance, confinementDefinitionSymbol, {
            value: Object.freeze(new ModuleConfinement(aConfinementConfiguration)),
        });

        // next we need to publish this module, so the outer world knows about this
        NodeModule._cache[fileToLoad] = newModuleInstance;

        // then we try to load the module
        let threw = true;
        try {
            newModuleInstance.load(fileToLoad);
            threw = false;
        }
        // and if loading the module failed, we delete it from cache.
        // Important: We don't need a catch(e) block, because we don't want to mutate
        // the error-Object! If we would catch and rethrow it, the stacktrace would
        // contain this code, and that's useless
        finally {
            if (threw) {
                delete NodeModule._cache[fileToLoad];
            }
        }

        // finally we return the exports of the generated module, because that's why this
        // function was called
        return newModuleInstance.exports;
    };
}

patchRequire(confinementDefinitionSymbol, modulesInConfinedStartUp);

module.exports = {
    installGeneralConfinement,
    patchConfinedRequire,
};

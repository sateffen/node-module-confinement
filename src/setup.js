const NodeModule = require('module');
const {patchRequire, confinedRequire} = require('./require');

const confinementDefinitionSymbol = Symbol('node-module-confinement');
const modulesInConfinedStartUp = new Map();
const modulesParentsMap = new Map();
let generalConfinementInstalled = false;

const boundConfinedRequire = confinedRequire.bind(null, confinementDefinitionSymbol, modulesInConfinedStartUp, modulesParentsMap);

/**
 * Installs a proxy for loading all node-modules in confinements
 * @param {Object} aConfinementConfiguration
 */
function installGeneralConfinement(aConfinementConfiguration) {
    if (generalConfinementInstalled) {
        throw new Error('General confinement already installed, cannot install twice');
    }

    generalConfinementInstalled = true;
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            /**
             * A proxy require function, that is used to execute the native require
             * @param {string} aModulePath The module path to load
             * @return {any} The resulting module
             */
            function proxyRequire(aModulePath) {
                return Reflect.apply(aTarget, aThisContext, [aModulePath]);
            }

            return boundConfinedRequire(proxyRequire, aThisContext, aArgumentsList[0], aConfinementConfiguration);
        },
    });
}

/**
 * Patches the general module prototype with the *confinedRequire* method
 */
function patchConfinedRequire() {
    NodeModule.prototype.confinedRequire = function loadConfinedModule(aModulePath, aConfinementConfiguration) {
        return boundConfinedRequire(NodeModule.prototype.require, this, aModulePath, aConfinementConfiguration);
    };
}

/**
 * Configures require
 * @param {Object} aConfigForRequire The config for require
 */
function init(aConfigForRequire) {
    patchRequire(confinementDefinitionSymbol, modulesInConfinedStartUp, modulesParentsMap, aConfigForRequire);
}

module.exports = {
    init,
    installGeneralConfinement,
    patchConfinedRequire,
};

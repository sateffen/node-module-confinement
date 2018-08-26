const NodeModule = require('module');
const ModuleConfinement = require('./moduleconfinement');

/**
 * Installs a proxy for loading all node-modules in confinements
 * @param {Object} aConfinementConfiguration
 */
function install(aConfinementConfiguration) {
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            const newModule = Reflect.apply(aTarget, aThisContext, aArgumentsList);

            newModule.confinementDefinition = new ModuleConfinement(aConfinementConfiguration);

            return newModule;
        },
    });
}

module.exports = {
    install,
};

require('./require');
require('./confinedrequire');

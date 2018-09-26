const {init, installGeneralConfinement, patchConfinedRequire} = require('./setup');

let nodeModuleConfinementIsConfigured = false;

/**
 * typedef {Object} NodeModuleConfinementConfiguration
 * @property {Object} generalConfinement
 * @property {boolean} patchWithConfinedRequire
 * @property {boolean} useRecursiveConfinement
 */

/**
 * Configures the node-module-confinement
 * @param {NodeModuleConfinementConfiguration} aConfiguration The node-module-confinement configuration
 */
function configure(aConfiguration) {
    if (nodeModuleConfinementIsConfigured) {
        throw new Error('node-module-confinement is already configured, tried to configure it a second time');
    }

    if (!aConfiguration || typeof aConfiguration !== 'object') {
        throw new TypeError('node-module-confinement needs an object as configuration');
    }

    if (aConfiguration.generalConfinement) {
        installGeneralConfinement(aConfiguration.generalConfinement);
    }

    if (aConfiguration.patchWithConfinedRequire) {
        patchConfinedRequire();
    }

    init(aConfiguration);
    nodeModuleConfinementIsConfigured = true;
}

module.exports = configure;

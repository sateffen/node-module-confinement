const NodeModule = require('module');

/**
 * Resolves given module name in given module context to the resolved filename
 * @param {Object} aModuleContext
 * @param {string} aModuleName
 * @return {string}
 */
function resolveModule(aModuleContext, aModuleName) {
    return NodeModule._resolveFilename(aModuleName, aModuleContext, false);
}

/**
 * Describes am module confinemint
 */
class ModuleConfinement {
    /**
     * The constructor for the module confinement
     * @param {Object} aRawConfinement
     * @param {Object} aModuleContext
     */
    constructor(aRawConfinement, aModuleContext) {
        const rawConfinement = aRawConfinement || {};
        const resolveModuleFunction = resolveModule.bind(null, aModuleContext);

        /**
         * Whether to allow internal modules completely or not
         * @type {boolean}
         */
        this.allowInternalModules = Boolean(rawConfinement.allowInternalModules);

        /**
         * The blacklist of modules to disallow completely
         * @type {Array<string>}
         */
        this.blackList = Array.isArray(rawConfinement.blackList) ? rawConfinement.blackList.map(resolveModuleFunction) : [];

        /**
         * The whitelist of modules to allow
         * @type {Array<string>}
         */
        this.whiteList = Array.isArray(rawConfinement.whiteList) ? rawConfinement.whiteList.map(resolveModuleFunction) : [];
    }
}

module.exports = ModuleConfinement;

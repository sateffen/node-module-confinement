/**
 * Describes am module confinemint
 */
class ModuleConfinement {
    /**
     * The constructor for the module confinement
     * @param {Object} aRawConfinement
     */
    constructor(aRawConfinement) {
        /**
         * Whether to allow internal modules completely or not
         * @type {boolean}
         */
        this.allowInternalModules = Boolean(aRawConfinement.allowInternalModules);

        /**
         * The blacklist of modules to disallow completely
         * @type {Array<string>}
         */
        this.blackList = Array.isArray(aRawConfinement.blacklist) ? aRawConfinement.blacklist : [];

        /**
         * The whitelist of modules to allow
         * @type {Array<string>}
         */
        this.whiteList = Array.isArray(aRawConfinement.whitelist) ? aRawConfinement.whitelist : [];
    }
}

module.exports = ModuleConfinement;

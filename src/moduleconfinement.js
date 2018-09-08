/**
 * Describes am module confinemint
 */
class ModuleConfinement {
    /**
     * The constructor for the module confinement
     * @param {Object} aRawConfinement
     */
    constructor(aRawConfinement) {
        const rawConfinement = aRawConfinement || {};

        /**
         * Whether to allow internal modules completely or not
         * @type {boolean}
         */
        this.allowInternalModules = Boolean(rawConfinement.allowInternalModules);

        /**
         * The blacklist of modules to disallow completely
         * @type {Array<string>}
         */
        this.blackList = Array.isArray(rawConfinement.blackList) ? rawConfinement.blackList : [];

        /**
         * The whitelist of modules to allow
         * @type {Array<string>}
         */
        this.whiteList = Array.isArray(rawConfinement.whiteList) ? rawConfinement.whiteList : [];
    }
}

module.exports = ModuleConfinement;

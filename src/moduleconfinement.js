import * as NodeModule from 'module';
import {isBoolean, isObject} from './utils';

/**
 * Defines a module confinement
 */
export class ModuleConfinement {
    /**
     * The constructor for a ModuleConfinement
     * @param {Object} aRawConfinement
     * @param {NodeModule} aModuleContext
     */
    constructor(aRawConfinement, aModuleContext) {
        const moduleFileNameHelper = (aModuleName) => NodeModule._resolveFilename(aModuleName, aModuleContext, false);
        const rawConfinement = typeof aRawConfinement === 'object' && aRawConfinement !== null ? aRawConfinement : {};

        /**
         * @type {boolean}
         */
        this.allowBuiltIns = isBoolean(rawConfinement.allowBuiltIns) ? rawConfinement.allowBuiltIns : true;
        /**
         * @type {boolean}
         */
        this.applyToChildren = isBoolean(rawConfinement.allowBuiltIns) ? rawConfinement.applyToChildren : false;

        /**
         * @type {Set<string>}
         */
        this.whiteList = new Set();
        /**
         * @type {Set<string>}
         */
        this.blackList = new Set();
        /**
         * @type {Map<string, string>}
         */
        this.redirect = new Map();

        if (Array.isArray(rawConfinement.whiteList) && rawConfinement.whiteList.length > 0) {
            for (let i = 0, iLen = rawConfinement.whiteList.length; i < iLen; i++) {
                const modulePath = moduleFileNameHelper(rawConfinement.whiteList[i]);

                this.whiteList.add(modulePath);
            }
        }

        if (Array.isArray(rawConfinement.blackList) && rawConfinement.blackList.length > 0) {
            for (let i = 0, iLen = rawConfinement.blackList.length; i < iLen; i++) {
                const modulePath = moduleFileNameHelper(rawConfinement.blackList[i]);

                this.blackList.add(modulePath);
            }
        }

        if (isObject(rawConfinement.redirect)) {
            const keys = Object.keys(rawConfinement.redirect);

            for (let i = 0, iLen = keys.length; i < iLen; i++) {
                const redirectFrom = moduleFileNameHelper(keys[i]);
                const redirectTo = moduleFileNameHelper(rawConfinement.redirect[keys[i]]);

                this.redirect.set(redirectFrom, redirectTo);
            }
        }
    }
}

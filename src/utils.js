const NodeModule = require('module');

/**
 * This function decides, whether given module is allowed to get called with given confinement
 * @param {ModuleConfinement} aConfinement
 * @param {string} aModule
 * @return {boolean}
 */
function isAllowedToCall(aConfinement, aModule) {
    return aConfinement.whiteList.includes(aModule) ||
        !aConfinement.blackList.includes(aModule) &&
        aConfinement.allowInternalModules && NodeModule.builtinModules.includes(aModule);
}

module.exports = {
    isAllowedToCall,
};

const NodeModule = require('module');

/**
 * This function decides, whether given module is allowed to get called with given confinement
 * @param {ModuleConfinement} aConfinement
 * @param {string} aModule
 * @return {boolean}
 */
function isAllowedToCall(aConfinement, aModule) {
    const notBlackListed = !aConfinement.blackList.includes(aModule);
    const isBuiltInModule = NodeModule.builtinModules.includes(aModule);

    return aConfinement.whiteList.includes(aModule) ||
        aConfinement.allowInternalModules && isBuiltInModule && notBlackListed ||
        aConfinement.allowInternalModules && !isBuiltInModule && notBlackListed ||
        !aConfinement.allowInternalModules && !isBuiltInModule && notBlackListed;
}

module.exports = {
    isAllowedToCall,
};

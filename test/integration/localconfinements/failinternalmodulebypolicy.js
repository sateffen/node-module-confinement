const {patchConfinedRequire} = require('../../../');

patchConfinedRequire();

module.confinedRequire('../loadfs', {
    allowInternalModules: false,
    blackList: [],
    whiteList: [],
});

const {patchConfinedRequire} = require('../../../');

patchConfinedRequire();

module.confinedRequire('../loadfs', {
    allowInternalModules: true,
    blackList: ['jest'],
    whiteList: [],
});

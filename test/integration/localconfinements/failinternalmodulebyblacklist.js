const {patchConfinedRequire} = require('../../../');

patchConfinedRequire();

module.confinedRequire('../loadfs', {
    allowInternalModules: true,
    blackList: ['fs'],
    whiteList: [],
});

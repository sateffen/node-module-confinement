const {patchConfinedRequire} = require('../../../src/lib');

patchConfinedRequire();

module.confinedRequire('../loadloadfs', {
    allowInternalModules: true,
    blackList: ['../loadfs'],
    whiteList: [],
});

const configure = require('../../../');

configure({
    patchWithConfinedRequire: true,
});

module.confinedRequire('../loadloadfs', {
    allowInternalModules: true,
    blackList: ['../loadfs'],
    whiteList: [],
});

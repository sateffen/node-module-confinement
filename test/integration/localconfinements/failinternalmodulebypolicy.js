const configure = require('../../../');

configure({
    patchWithConfinedRequire: true,
});

module.confinedRequire('../loadfs', {
    allowInternalModules: false,
    blackList: [],
    whiteList: [],
});

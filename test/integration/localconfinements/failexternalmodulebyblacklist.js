const configure = require('../../../');

configure({
    patchWithConfinedRequire: true,
});

module.confinedRequire('../loadfs', {
    allowInternalModules: true,
    blackList: ['jest'],
    whiteList: [],
});

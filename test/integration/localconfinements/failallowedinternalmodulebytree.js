const configure = require('../../../');

configure({
    patchWithConfinedRequire: true,
});

module.confinedRequire('./allowinternalmodulebywhitelist', {
    allowInternalModules: false,
    blackList: [],
    whiteList: [],
});

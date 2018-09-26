const configure = require('../../../');

configure({
    patchWithConfinedRequire: true,
    useRecursiveConfinement: false,
});

module.confinedRequire('./allowinternalmodulebywhitelist', {
    allowInternalModules: false,
    blackList: [],
    whiteList: [],
});

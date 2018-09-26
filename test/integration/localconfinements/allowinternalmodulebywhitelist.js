const configure = require('../../../');

try {
    configure({
        patchWithConfinedRequire: true,
    });
}
catch (e) {}

module.confinedRequire('../loadfs', {
    allowInternalModules: false,
    blackList: [],
    whiteList: ['fs'],
});

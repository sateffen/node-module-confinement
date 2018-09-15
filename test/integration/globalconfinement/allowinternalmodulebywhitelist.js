const {installGeneralConfinement} = require('../../../');

installGeneralConfinement({
    allowInternalModules: false,
    blackList: [],
    whiteList: ['fs'],
});

require('../loadfs');

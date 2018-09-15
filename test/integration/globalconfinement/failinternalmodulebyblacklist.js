const {installGeneralConfinement} = require('../../../');

installGeneralConfinement({
    allowInternalModules: true,
    blackList: ['fs'],
    whiteList: [],
});

require('../loadfs');

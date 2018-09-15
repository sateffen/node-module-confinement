const {installGeneralConfinement} = require('../../../');

installGeneralConfinement({
    allowInternalModules: false,
    blackList: [],
    whiteList: [],
});

require('../loadfs');

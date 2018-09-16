const {installGeneralConfinement} = require('../../../');

installGeneralConfinement({
    allowInternalModules: true,
    blackList: ['../loadfs'],
    whiteList: [],
});

require('../loadloadfs');

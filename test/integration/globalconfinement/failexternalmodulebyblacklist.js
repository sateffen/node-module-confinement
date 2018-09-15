const {installGeneralConfinement} = require('../../../src/lib');

installGeneralConfinement({
    allowInternalModules: true,
    blackList: ['jest'],
    whiteList: [],
});

require('../loadjest');

const configure = require('../../../');

configure({
    generalConfinement: {
        allowInternalModules: true,
        blackList: ['../loadfs'],
        whiteList: [],
    },
});

require('../loadloadfs');

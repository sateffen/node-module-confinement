const configure = require('../../../');

configure({
    generalConfinement: {
        allowInternalModules: false,
        blackList: [],
        whiteList: [],
    },
});

require('../loadfs');

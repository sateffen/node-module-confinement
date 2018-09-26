const configure = require('../../../');

configure({
    generalConfinement: {
        allowInternalModules: false,
        blackList: [],
        whiteList: ['fs'],
    },
});

require('../loadfs');

const configure = require('../../../');

configure({
    generalConfinement: {
        allowInternalModules: true,
        blackList: ['fs'],
        whiteList: [],
    },
});

require('../loadfs');

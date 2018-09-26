const configure = require('../../../');

configure({
    generalConfinement: {
        allowInternalModules: true,
        blackList: ['jest'],
        whiteList: [],
    },
});

require('../loadjest');

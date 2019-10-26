const {setup} = require('../../../dist/node-module-confinement');

setup(module, {
    defaultConfinement: {
        allowBuiltIns: false,
        whiteList: [],
    },
    confinements: {
        './second': {
            blackList: ['./third'],
        },
        './third': {
            allowBuiltIns: false,
            whiteList: ['fs'],
        },
    },
});

require('./second');

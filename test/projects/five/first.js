const {setup} = require('../../../dist/node-module-confinement');

setup(module, {
    defaultConfinement: {
        allowBuiltIns: true,
        whiteList: [],
    },
    confinements: {
        './second': {
            applyToChildren: false,
            allowBuiltIns: false,
            whiteList: [],
        },
    },
});

require('./second');

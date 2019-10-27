const {setup} = require('../../../../dist/node-module-confinement');

setup(module, {
    defaultConfinement: {
        allowBuiltIns: true,
        whiteList: [],
    },
    confinements: {
        './second': {
            applyToChildren: true,
            allowBuiltIns: false,
            whiteList: [],
        },
    },
});

require('./second');

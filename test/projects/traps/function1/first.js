const {setup} = require('../../../../dist/node-module-confinement');

setup(module, {
    defaultConfinement: {
        allowBuiltIns: false,
        whiteList: [],
    },
    addons: {
        trapFunction: true,
    },
});

require('./second');

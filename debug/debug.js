global.Function = new Proxy(global.Function, {
    construct() {
        throw new Error('Cannot construct that!');
    },
});

global.eval = new Proxy(global.eval, {
    apply(aTarget, aThisContext, aArgumentsList) {
        throw new Error('eval is bad!');
    },
});
const NodeModule = require('module');
NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
    apply(aTarget, aThisContext, aArgumentsList) {
        const module = Reflect.apply(aTarget, aThisContext, aArgumentsList);

        return Object.freeze(module);
    },
});

const {setup} = require('../dist/node-module-confinement');

setup(module, {
    defaultConfinement: {
        allowBuiltIns: false,
        whiteList: [],
    },
    confinements: {
        './debug1': {
            // blackList: ['./debug2'],
        },
        './debug2': {
            allowBuiltIns: false,
            whiteList: ['fs'],
        },
    },
});

const d = require('./debug1');
console.log('debug', module.id);

// eval('console.log("other");');

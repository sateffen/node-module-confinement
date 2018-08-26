const NodeModule = require('module');

NodeModule.prototype.confinedRequire = function loadConfinedModule(aPath, aConfinementConfiguration) {
    // first determine the file to lad
    const fileToLoad = NodeModule._resolveFilename(aPath, this, false);

    // and than instanciate the file
    const newModuleInstance = new NodeModule(aPath, this);
    newModuleInstance.confinementDefinition = {};

    // next we need to publish this module, so the outer world knows about this
    NodeModule._cache[fileToLoad] = newModuleInstance;

    // then we try to load the module
    let threw = true;
    try {
        newModuleInstance.load(fileToLoad);
        threw = false;
    }
    // and if loading the module failed, we delete it from cache.
    // Important: We don't need a catch(e) block, because we don't want to mutate
    // the error-Object! If we would catch and rethrow it, the stacktrace would
    // contain this code, and that's useless
    finally {
        if (threw) {
            delete NodeModule._cache[fileToLoad];
        }
    }

    // finally we return the exports of the generated module, because that's why this
    // function was called
    return newModuleInstance.exports;
};

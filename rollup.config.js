const NodeModule = require('module');

module.exports = {
    input: 'src/lib.js',
    output: {
        file: 'dist/node-module-confinement.js',
        format: 'cjs',
        sourceMap: false,
        interop: false,
        preferConst: true,
    },
    plugins: [],
    external: NodeModule.builtinModules,
};

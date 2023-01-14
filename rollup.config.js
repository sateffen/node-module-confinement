const NodeModule = require('module');

module.exports = {
    input: 'src/lib.js',
    output: {
        file: 'dist/node-module-confinement.js',
        format: 'cjs',
        sourcemap: false,
        generatedCode: {
            constBindings: true,
        },
        interop: 'compat',
    },
    plugins: [],
    external: NodeModule.builtinModules
        .map((aModuleName) => `node:${aModuleName}`),
};

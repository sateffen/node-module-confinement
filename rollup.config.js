const NodeModule = require('module');

module.exports = {
    input: 'src/lib.js',
    output: {
        file: 'dist/node-module-confinement.js',
        format: 'cjs',
        sourcemap: false,
        generatedCode: {
            preset: 'es2015',
        },
        interop: 'compat',
    },
    plugins: [],
    external: NodeModule.builtinModules
        .map((aModuleName) => `node:${aModuleName}`),
};

const NodeModule = require('module');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
    input: 'src/lib.js',
    output: {
        file: 'dist/node-module-confinement.js',
        format: 'cjs',
        sourceMap: false,
        interop: false,
    },
    plugins: [
        nodeResolve({}),
        commonjs({}),
    ],
    external: NodeModule.builtinModules,
};

# node-module-confinement

This package provides a simple way for confining modules and preventing them to load unwanted other modules.

You can set up a blacklist and a whitelist for this confinement. You can tell the confinement to prevent node
internal modules completely, only allowing a few ones by whitelist. That's useful when loading code you don't
know or trust, like packages from npm or plugins for your software.

If anything defies the confinement, an error is thrown to prevent anything bad from happening. The error tells
you which confinement was defied and which module did this.

This module integrates deeply in node by providing a proxy for the `require` method. There shouldn't be any
difference, except an error when something not allowed is happening.

## API

The basic API consists of just one function: `configure(configuration)`. You can use it as follows:

```js
const configureNodeModuleConfinement = require('node-module-confinement');

configureNodeModuleConfinement({
    useRecursiveConfinement: true,
    patchWithConfinedRequire: false,
    generalConfinement: {
        allowInternalModules: false,
        blackList: [],
        whiteList: ['fs', 'path']
    }
});
```

The module itself is just the `configure` function and takes a configuration-object.

### Configuration object

The configuration object contains the following fields:

#### useRecursiveConfinement

**type**: `boolean`

**default**: `true`

**description**: If true a module has to fulfill all confinements along the module-tree (if multiple are available).
This prevents overriding confinements with weaker ones with `confinedRequire` and prevents loopholes in the confinement system.

#### patchWithConfinedRequire

**type**: `boolean`

**default**: `false`

**description**: Whether to patch the module prototype with the `confinedRequire` method or not. For details about that method
see further down.

#### generalConfinement

**type**: `Object`

**default**: `{allowInternalModules: false, blackList: [], whiteList: []}`

**description**: Describes a general confinement, that is applied to all consecutive require calls in the application.

##### generalConfinement.allowInternalModules

**type**: `boolean`

**default**: `false`

**description**: Allows or disallows loading of node internal modules generally (so *fs*, *path*, *net*, *child_process*, ...)

##### generalConfinement.blackList

**type**: `Array<string>`

**default**: `[]`

**description**: Holds a list of modules, that are forbidden from getting loaded in the confinement. This can be any node internal
module, as well as own modules. Each module is resolved to its node-module-id, so even relative modules can get blacklisted.

##### generalConfinement.whiteList

**type**: `Array<string>`

**default**: `[]`

**description**: Holds a list of modules, that are permitted to load, regardless of the other rules. This overrides the `blackList`
and `allowInternalModules`. The basic usage is to set `allowInternalModules=false` and permit the needed internal modules with this
whitelist. Just like in `blackList` all modules are resolved to its node-module-id, so it works with relative modules as well.

### confinedRequire

If `patchWithConfinedRequire` is set to `true`, this module will patch the module prototype with a method called `confinedRequire`.
You can invoke this by calling `module.confinedRequire` in any part of your code after configuring node-module-confinement once.

This function will invoke the real require method, but apply an additional confinement to the required module and its subtree. That way
you can load different parts of the module tree with different confinements. Depending on `useRecursiveConfinement` the module loaded
has to fulfill only the given confinement (`useRecursiveConfinement=false`) or all confinements in the module tree as well
(`useRecursiveConfinement=true`).

The type signature is `module.confinedRequire(moduleName: string, confinement: Confinement)`, where `Confinement` is the same format as
`generalConfinement` for `configure`.

```js
const {configure} = require('node-module-confinement');

configure({
    patchWithConfinedRequire: true
    // ... other config here
});

const untrustedModule = module.confinedRequire('some-untrusted-module', {
    allowInternalModules: false,
    blackList: [],
    whiteList: ['utils']
});
```

## Caveats

This module does not guarantee perfect security, it just helps with preventing unexpected or unwanted module usage.
Here are some more things to take care of by yourself:

1. This module doesn't prevent `eval` or `new Function` stuff. Both help others to execute code, that can be anything.
The good thing: That evaluated code uses the same `require` function, so at least the require-calls from inside `eval`
and `new Function` are confined.
2. If your confinement blacklists for example `lodash`, the general module `lodash` is denied from loading. Remember: Not
the name `lodash` is filtered, the module-id for `lodash` is filtered, so `require('../node_modules/lodash')` will be denied as well,
but loading a certain file from the module, like `lodash/foreach` is not denied, because it's a different module-id. The main purpose
of this library is to prevent node internal modules from getting loaded. That's archived by using the node-module-id, so defying other
modules is possible as well, but not that secure as expected all the time. It's not impossible to build this however, so if there's any
demand for that, open an issue or pullrequest.
3. Setting up a well confined module-tree takes some time. You can't just load this module and it's alright, you have to do some tweaking
as well.
4. Using a configuration like `{useRecursiveConfinement: false, patchWithConfinedRequire: true}` might simplify the confinement setup,
but opens up a little loophole, where malicious code could execute `module.confinedRequire('child_process', {allowInteralModules: true, whiteList: [], blackList: []}`
and circumvent the provided security.

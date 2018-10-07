# node-module-confinement

![Codeship Status for sateffen/node-module-confinement](https://app.codeship.com/projects/1cddd2b0-9582-0136-366d-3e732d40e2ee/status?branch=master)

This package provides a simple way for confining modules, and preventing them to load unwanted other modules.

For this confinement you can set up a blacklist and a whitelist. You can tell the confinement to prevent node
internal modules completely, only allowing a few ones by whitelist. That's useful when loading code you don't
know or don't trust, like packages from npm or plugins for your software.

If anything defies the confinement, an error is thrown to prevent anything bad from happening. The error tells
you which confinement was defied, and which module did this.

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
This is to prevent overriding confinements with weaker ones with `confinedRequire` and prevents loopholes in the confinement system.

#### patchWithConfinedRequire

**type**: `boolean`

**default**: `false`

**description**: Whether to patch the module prototype with the `confinedRequire` method. The method is described later on.

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

**description**: Holds a list of modules, that are forbidden from getting loaded in the confinement. This can be any internal module,
as well as own modules. Each module is resolved to its node-module-id, so even relative modules can get blackListed.

##### generalConfinement.whiteList

**type**: `Array<string>`

**default**: `[]`

**description**: Holds a list of modules, that are permitted to load, regardless of the other rules. This overrides the `blackList`
and `allowInternalModules`. The basic usage is to set `allowInternalModules=false` and permit the needed internal modules with this
whiteList. Just like the `blackList` all modules are resolved to its node-module-id, so it works with relative modules as well.

### confinedRequire

If `patchWithConfinedRequire` is set to `true`, this module will patch the module prototype with a method called `confinedRequire`.
You can invoke this by calling `module.confinedRequire` right in your code, right in the module context of the current module.

This function will invoke the real require method, but apply a different confinement to the required module and its subtree. That way
you can load different parts of the module tree with different confinements. Depending on `useRecursiveConfinement` the module loaded
has to fulfill only that one confinement, or all confinements in the module tree as well.

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

This module does not guarantee perfect security, it just helps with preventing unexpected or unwanted module usage,
but there is some more to take care of:

1. This module doesn't prevent `eval` or `new Function` stuff. Both help others to execute code, that can be anything,
but the good thing: This code reuses the same `require` function, so at least the require-calls from inside `eval` and `new Function`
are confined.
2. If your confinement blacklists for example `lodash`, the general module `lodash` is denied from loading. Remember: Not
the name `lodash` is filtered, the module-id for `lodash` is filtered, so `require('node_modules/lodash')` will be denied as well,
but loading a certain file from the module, like `lodash/foreach` is not denied. The main purpose was to prevent node internal modules
from getting loaded. Everything else is prevented by resolving the module to a certain file and check whether the absolute path of
that file is allowed (node uses the file as module-id, and I use the same method).
3. Setting up a good confinement takes time. Especially, if different parts of your application should get a different confinement, it's
a little complicated to structure the module-tree correctly.
4. Using a configuration like `{useRecursiveConfinement: false, patchWithConfinedRequire: true}` might simplify the confinement setup,
but opens up a little loopholes, where malicous code could execute `module.confinedRequire('child_process', {allowInteralModules: true, whiteList: [], blackList: []}`
and cirumvent the provided security.

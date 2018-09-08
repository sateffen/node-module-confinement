# node-module-confinement

![Codeship Status for sateffen/node-module-confinement](https://app.codeship.com/projects/1cddd2b0-9582-0136-366d-3e732d40e2ee/status?branch=master)

This package provides a simple way for confining modules, and preventing them to load unwanted other modules.

For this confinement you can setup a blacklist and a whitelist. You can tell the confinement to prevent node
internal modules completely, only allowing a few ones by whitelist. That's useful when loading code you don't
know or don't trust, like packages from npm or plugins for your software.

If anything defys the confinement, an error is thrown to prevent anything bad from happening. The error tells
you which confinement was defied, and which module did this.

## API

### require

When requiring `node-module-confinement` the original `require` function of your node process is overwritten.
The overwritten version checks each require-call for a confinement, and checks the rules provided by it.
A confinement itself is defined on the module instance as `confinementDefinition` property. If no confinement
definition is found on the own module, the module-tree is traversed up, until one is found, or the root is
reached. So in a structure:

```
root
|-confined-module1 (has confinement)
  |-sub-module-1
  |-sub-module-2
    |-sub-module3
|-confined-module2 (has confinement)
  |-sub-module-2
```

When `sub-module3` executes `require`, the tree will be traversed and the confinement set on `confined-module1` is
used. That allows different module-trees with different confinements, but beware: Modules are still instanciated
just once, just like usual in node. In the above example, `sub-module-2` will be confined by `confined-module1`, but
not by `confined-module2`.

### confinement definition

A confinement definition tells the confinement the rules to apply when requiring modules. There are 3 basic rules:

* allowInternalModules: This property is a boolean, telling whether to allow (`true`) or disallow (`false`) all node-
internal modules by default. The default value is `false`. Whitelisted node-modules are allowed, even when this property
is set to `false`.
* blackList: This property is an array of strings, telling module names that are disallowed to load in this confinement.
This can be any module-name, but has to be the complete module-name, that is passed to `require(...)`.
* whiteList: This property is an array of strings, telling modules that are allowed to load. This overrides the allowInternalModules
flag and even the blackList. So if there is the same module in the whitelist and blacklist, the module is still allowed
to be loaded.

**Example**

```js
// only allows "fs" and "path" as internal modules, and prevents lodash from being loaded
{
    allowInternalModules: false,
    blackList: ['lodash'],
    whiteList: ['fs', 'path']
}
```
All properties are optional.

### installGeneralConfinement(confinement)

This function patches the general require function with a simple wrapper, so each new loaded module gets given 
confinement applied.

You can only apply one general confinement, and you can't overwrite it after applying once.

**Example**

```js
const nodeModuleConfinement = require('node-module-confinement');

// for this module we don't have any confinement, because non is installed
const firstModule = require('first-module');

// all subsequent require calls, will follow this confinement
nodeModuleConfinement.installGeneralConfinement({
    allowInternalModules: false,
    blackList: ['lodash'],
    whiteList: ['fs', 'path']
});

// the second module has the general confinement, set by "installGeneralConfinement"
const secondModule = require('second-module');
```

### patchConfinedRequire

This is an utility function, patching the general module-prototype with a new function called `confinedRequire`.
The new function has the signature `module.confinedRequire(path, confinement)`, and is an alternative version
of require, which applys given confinement - regardless of any general confinements.

You have to patch the module explicitly, because this modifies the prototype of an internal module. Why patch
the module prototype? Because that way the correct module-instance is referenced, and the module-tree is not
changed in any way.

`module.confinedRequire` behaves exactly like `require`. It'll generate an entry in the module-cache, it'll set
the loaded module as child in the module-tree, just like require, and if any error occurs, the error is thrown
without node-module-confinement bloating the stacktrace more than needed.

**Example**

```js
const nodeModuleConfinement = require('node-module-confinement');

// module.confinedRequire does not exist
nodeModuleConfinement.patchConfinedRequire();

// lodash follows the given confinement, and the subtree of modules doesn't have access to any
// node internal modules
const confinedLodash = module.confinedRequire('lodash', {allowInternalModules: false});
```

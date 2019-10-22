# node-module-confinement

**This branch currently contains a complete rewrite of node-module-confinement. This is not tested yet and not complete. Use with care.**

This package provides a simple way for confining modules and preventing them to load unwanted other modules,
or redirect modules to load to different ones.

You can set up a blacklist and a whitelist for this confinement. You can tell the confinement to prevent node
internal modules completely, only allowing a few ones by whitelist. That's useful when loading code you don't
know or trust, like packages from npm or plugins for your software.

If anything defies the confinement, an error is thrown to prevent anything bad from happening. The error tells
you which confinement was defied and which module did this.

Additionally, you can define redirects of modules to load to different modules. You can use this to redirect
calls to `fs` to your own version of `fs` for example, to filter filesystem functions as well.

This module integrates deeply in node by providing a proxy for the `require` method. There shouldn't be any
difference, except an error when something not allowed is happening.

Additionally, there is an option do install some more "addons", which setup traps, or harden security.

## API

The main API exists of only a single function: `setup`. The signature is: `setup(moduleContext, confinementConfiguration)`

The `moduleContext` is the current `module` value. This is used to resolve all modules referenced by the
`confinementConfiguration`.

The `confinementConfiguration` is the most important part, and looks something like this:

```js
const confinementConfiguration = {
    defaultConfinement: {
        allowBuiltIns: true
        blackList: [],
        whiteList: [],
        redirect: {}
    },
    confinements: {
        './some/module.js': {
            applyToChildren: false,
            allowBuiltIns: false
            blackList: [],
            whiteList: ['fs', 'path'],
            redirect: {}
        },
        './some/other/module.js': {
            applyToChildren: false,
            allowBuiltIns: false
            blackList: [],
            whiteList: [],
            redirect: {}
        }
    },
    addons: {
        trapEval: false,
        trapFunction: false,
        freezeModules: false
    }
};
```

### Confinements

So, bascially a confinement consists of 4 main rules: `allowBuiltIns`, `whiteList`, `blackList` and `redirect`. The rules are applied as follows:

First of let's look at `whiteList` and `blackList`, as they are the most straight forward. `whiteList`ed modules are allowed by
default, `blackList`ed modules are denied by default. All modules passed in this arrays get resolved to their actual module-filename.
To do so all modules get resolved relative to given `moduleContext` (which was passed as first parameter to `setup`-function).

The second part to consider is the `allowBuiltIns` flag, which tells to allow or deny all builtin nodejs modules. So if you put `allowBuiltIns=false`
calling stuff like `require('fs')` will throw an error. This is basically a shortcut to add all node builtin modules to the `blackList`. To allow
loading at least some builtin modules, you can pass them to the `whiteList`, so you can write a confinement like `{allowBuiltIns: false, whiteList: ['fs']}`
to allow `require('fs')`, but deny all other builtins like `require('path')`.

After applying all the rules above, we know whether the current `require` call is allowed or forbidden. If it's allowed, the last property comes into
play: `redirect`. This contains a map of `module -> module` contents. So if the module wants to load a certain other module, you can redirect the call to
load yet another module. This is useful for example when redirecting builtins to mocks or limited variants, something like:

```js
const confinementConfiguration {
    defaultConfinement: {
        allowBuiltIns: false,
        whiteList: ['fs'],
        redirect: {
            'fs': './myfsmock.js'
        }
    }
}
```

That way we can redirect require calls to different modules for security purpose (or whatever).

The last option of a confinement is `applyToChildren`, which is a flag only applied during confinement evaluation. To know understand
this flag, you have to understand how confinements get resolved:

* First the module, that should be loaded, gets resolved to its module-filename
* Then we check, whether the resolved module-filename matches with any `confinements`-entry. If so, we use this confinement
* Because we have no specific confinement, we traverse the module-tree upwards, to check whether any parent has a confinement.
If any parent has a confinement, we check the `applyToChildren` flag. If it's true, we use this confinement. If it's false,
we traverse the tree upwards up to the root module (provided `moduleContext`)
* If we couldn't find any confinement up till now, we use the `defaultConfinement`
* If the `defaultConfinement` was empty, no confinement is applied

This should make it obvious, what `applyToChildren` does.

This should explain everything about confinements, that you need to know.

### Addons

Another special topic is "addons". This module contains some addons, that help with securing your application. You can apply the
following addons by simply setting them to `true` in the configuration.

#### trapEval

This is pretty obvious: Proxy the global `eval` function and throw an error each time it gets called. This way `eval` doesn't work
anymore, and malicious `eval`-calls are prevented.

#### trapFunction

This is basically as obvious as the previous one, but most people don't know about this one: The function constructor is basically
a hidden `eval` function. Stuff like `Function('console.log(process.pid);')()` might not do bad, but does the same as
`eval('console.log(process.pid);')`, so its basically eval in disguise.

To prevent usage of this hidden eval-like stuff, you can apply a trap by enabling this option. This trap will prevent all `Function(...)`
and `new Function(...)` calls and throw an error each time it happens.

#### freezeModules

This is a simple spell, but quite unbreakable - and maybe troublesome. This module will call `Object.freeze` on each module,
that gets returned from `require(...)`. This way modules can't get "patched" by bad versions of malicious code (like malicious
node-modules), but there is one catch: Cyclic dependencies don't work anymore.

In 90%, maybe even more, this should not break your application, but not all applications work flawlessly with this.

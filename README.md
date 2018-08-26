# node-module-confinement

**warning**: Early preview

This module is for a security module, that creates confinements of for node_modules.

A confinement is a simple description, what a module is allowed to require, and what not. This way you can 
prevent unknown modules from loading node internals like *fs* or *net*, so the modules can't do any harm with 
them.

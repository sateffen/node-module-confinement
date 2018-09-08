# node-module-confinement

![Codeship Status for sateffen/node-module-confinement](https://app.codeship.com/projects/1cddd2b0-9582-0136-366d-3e732d40e2ee/status?branch=master)

**warning**: Early preview

This module is for a security module, that creates confinements of for node_modules.

A confinement is a simple description, what a module is allowed to require, and what not. This way you can 
prevent unknown modules from loading node internals like *fs* or *net*, so the modules can't do any harm with 
them.

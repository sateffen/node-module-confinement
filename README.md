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

Coming soon
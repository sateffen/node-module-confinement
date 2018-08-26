const NodeModule = require('module');
const {isAllowedToCall} = require('./utils');

NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
    apply(aTarget, aThisContext, aArgumentsList) {
        let confinedModule = aThisContext;

        while (confinedModule && !confinedModule.confinementDefinition) {
            confinedModule = confinedModule.parent;
        }

        if (confinedModule) {
            const confinementDefinition = confinedModule.confinementDefinition;
            const moduleToLoad = aArgumentsList[0];

            if (!isAllowedToCall(confinementDefinition, moduleToLoad)) {
                throw new Error(`Module with id "${aThisContext.id}" wants to load forbidden module ${moduleToLoad} (confined by module: ${confinedModule.id})`);
            }
        }

        return Reflect.apply(aTarget, aThisContext, aArgumentsList);
    },
});

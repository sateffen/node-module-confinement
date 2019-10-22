import * as NodeModule from 'module';
import {confinementsMap, defaultConfinementCell, rootModuleCell} from './shared';
import {isNodeModule} from './utils';

/**
 * This function decides, whether given module is allowed to get called with given confinement
 * @param {ModuleConfinement} aConfinement
 * @param {string} aModule
 * @return {boolean}
 */
function isAllowedToCall(aConfinement, aModule) {
    const notBlackListed = !aConfinement.blackList.has(aModule);
    const isBuiltInModule = NodeModule.builtinModules.includes(aModule);
    const allowBuiltIns = aConfinement.allowBuiltIns;

    return aConfinement.whiteList.has(aModule) ||
        !isBuiltInModule && notBlackListed ||
        allowBuiltIns && isBuiltInModule && notBlackListed;
}

/**
 * Tries to find the confinement for given module
 * @param {NodeModule} aModuleContext
 * @param {string} aModule
 * @return {ModuleConfinement | null}
 */
function findConfinementFor(aModuleContext) {
    const rootModule = rootModuleCell.get();
    let targetConfinement = defaultConfinementCell.get();

    if (confinementsMap.has(aModuleContext.id)) {
        targetConfinement = confinementsMap.get(aModuleContext.id);
    }
    else {
        for (let it = aModuleContext.parent; isNodeModule(it) && it !== rootModule; it = it.parent) {
            if (confinementsMap.has(it.id)) {
                const confinement = confinementsMap.get(it.id);

                if (confinement.applyToChildren) {
                    targetConfinement = confinement;
                    break;
                }
            }
        }
    }

    return targetConfinement;
}

/**
 * Installs a proxy for the require function in node, confining all modules based on shared rules
 */
export function installRequireProxy() {
    NodeModule.prototype.require = new Proxy(NodeModule.prototype.require, {
        apply(aTarget, aThisContext, aArgumentsList) {
            const moduleFileName = NodeModule._resolveFilename(aArgumentsList[0], aThisContext, false);
            const confinementToFulfill = findConfinementFor(aThisContext);

            if (confinementToFulfill !== null && !isAllowedToCall(confinementToFulfill, moduleFileName)) {
                throw new Error(`NodeModuleConfinement: Confinement violation found! Loading "${moduleFileName}" from "${aThisContext.id}" is not allowed!`);
            }

            const argumentList = aArgumentsList.slice();
            if (confinementToFulfill.redirect.has(moduleFileName)) {
                argumentList[0] = confinementToFulfill.redirect.get(moduleFileName);
            }

            return Reflect.apply(aTarget, aThisContext, argumentList);
        },
    });
}

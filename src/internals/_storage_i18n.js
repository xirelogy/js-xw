import configBuild from "../config/build"
import storage from "../internals/_storage";


/**
 * @typedef I18nStoreStruct
 * @property {string} currentLocale The current locale
 * @property {Map<string, Map>} classMap Map classes to its locale strings
 * @property {Map<string, boolean>} classInits Classes to be initialized
 */


/**
 * Get or initialize a global storage for i18n
 * @return {I18nStoreStruct}
 * @private
 */
export function getI18nStore() {
    return storage.getStore('i18n', {
        currentLocale: configBuild.getDefaultLocale(),
        classMap: new Map(),
        classInits: new Map(),
    })
}

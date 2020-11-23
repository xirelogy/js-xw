import xw from "./Xw";
import axw from "./XwAsync";
import i18n from "./XwI18n";
import {getI18nStore as _d} from "./internals/_storage_i18n";


// Initialized
_d().isInit = true;


/**
 * Get an item from the map, and if it doesn't exist, initialize it
 * @template T
 * @param {Map<string, T>} map Target map object
 * @param {string} key Key of the item
 * @param {T} init Initialize object if item doesn't exist
 * @return {T} Value in map
 * @private
 */
function _mapGet(map, key, init) {
    if (!map.has(key)) {
        map.set(key, init);
    }

    return map.get(key);
}


/**
 * Internationalization setup (i18n) support
 * @class
 * @hideconstructor
 */
class XwI18nSetup {

    /**
     * @methodOf XwI18nSetup
     * @param {string|null} className Class name or namespace for the localization
     * @param {string} locale Locale code
     * @param {Object<string, string>} definitions A key value map for the translations
     */
    define(className, locale, definitions) {

        const __d = _d();
        const _classLocales = _mapGet(__d.classMap, className, new Map());
        const _localeStrings = _mapGet(_classLocales, locale, {});

        for (const keyString in definitions) {
            if (!definitions.hasOwnProperty(keyString)) continue;
            if (keyString === null || keyString === '') continue;
            _localeStrings[keyString] = definitions[keyString];
        }
    }


    /**
     * @methodOf XwI18nSetup
     * Define rules to construct automatically load i18n resources
     * @param {function(string, string):string|null} fn The function to construct the resource,
     *        className and locale will be passed over to the function.
     */
    defineAutoloadRule(fn) {
        _d().autoloadRuleFn = fn;
    }


    /**
     * @methodOf XwI18nSetup
     * If the rules for automatically load is provided and supported
     * @return {boolean}
     */
    hasAutoloadRule() {
        return xw.defaultable(_d().autoloadRuleFn) !== null;
    }


    /**
     * @methodOf XwI18nSetup
     * Load locale from given URL having the JSON
     * @param {string|null} className Class name or namespace for the localization
     * @param {string} locale Locale code
     */
    async autoload(className, locale) {
        const fn = xw.defaultable(_d().autoloadRuleFn);
        if (fn === null) throw new Error('No autoload defined');

        const src = fn(className, locale);
        const data = await xw.loadJsonp(src);
        this.define(className, locale, data);
    }


    /**
     * @methodOf XwI18nSetup
     * Automatically init all locales
     * @return {Promise<boolean>} If the automatic initialization had run
     */
    async autoinit() {
        if (!this.hasAutoloadRule()) return false;

        const promises = [];
        const currentLocale = i18n.currentLocale;

        for (const key of _d().classInits.keys()) {
            const promise = this.autoload(key, currentLocale);
            promises.push(promise);
        }

        await axw.waitAll(promises, {
            ignoreErrors: true,
        });

        return true;
    }
}


const i18nSetup = new XwI18nSetup();
export default i18nSetup;




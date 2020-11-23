import configBuild from "./config/build"
import {getI18nStore as _d} from "./internals/_storage_i18n";


/**
 * Get current locale
 * @return {string} The current locale
 * @private
 */
function _getCurrentLocale() {
    const currentLocale = _d().currentLocale;
    if (typeof currentLocale === 'undefined') return configBuild.getDefaultLocale();
    if (currentLocale === null) return configBuild.getDefaultLocale();

    return currentLocale;
}


/**
 * Set the current locale
 * @param {string} locale The locale to be set
 * @private
 */
function _setCurrentLocale(locale) {
    _d().currentLocale = locale;
}


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
 * Internationalization (i18n) support
 * @property {string} currentLocale Current locale used
 * @class
 * @hideconstructor
 */
class XwI18n {
    /**
     * Constructor
     */
    constructor() {
        Object.defineProperty(this, 'currentLocale', {
            get() {
                return _getCurrentLocale();
            },
            set(v) {
                _setCurrentLocale(v);
            }
        })
    }


    /**
     * Initialize and create a translation function, using the given class name
     * as the namespace of the localization.
     * @param {string} [className] Class name or namespace for the localization
     * @return {function(string): string} Adapter function to get localized string for given original string
     */
    init(className) {

        const __d = _d();

        // Ensure this is in classInits
        _mapGet(__d.classInits, className, true);

        return (text) => {
            if (typeof text === 'undefined') return '';

            const _text = '' + text;

            if (!__d.classMap.has(className)) return _text;

            const currentLocale = _getCurrentLocale();
            const _classLocales = __d.classMap.get(className);
            if (!_classLocales.has(currentLocale)) return _text;

            const localeStrings = _classLocales.get(currentLocale);
            if (typeof localeStrings[_text] === 'undefined') return _text;

            return localeStrings[_text];
        }
    }
}


const i18n = new XwI18n();
export default i18n;
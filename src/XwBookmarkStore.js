import xw from "./Xw";
import urlBase64 from "./XwUrlBase64";


/**
 * Load the bookmark store as a value store
 * @private
 */
function _loadAsObject() {
    const rawString = bookmarkStore.loadString();
    if (rawString === null) return {};

    try {
        const jsonString = urlBase64.decode(rawString);
        return JSON.parse(jsonString);
    } catch (e) {
        // Fallback
        return {};
    }
}


/**
 * Store information in the bookmark (fragement) part of the page
 * URL, so to preserve information across forward and back actions
 * in page browsing
 * @class
 * @hideconstructor
 */
class XwBookmarkStore {
    /**
     * Save a string value and store it in the bookmark
     * @param {string|null} value Value to be saved, or when null, clear the bookmark storage
     */
    saveString(value) {
        const _value = xw.requires(value);
        if (_value !== null) {
            window.location.replace(window.location.pathname + window.location.search + '#' + encodeURIComponent(value));
        } else {
            window.location.replace(window.location.pathname + window.location.search);
        }
    }


    /**
     * Load the data stored in the bookmark as an entire string
     * @return {string|null} The stored string, if any
     */
    loadString() {
        const hash = window.location.hash;
        if (hash === '') return null;
        if (hash[0] !== '#') return decodeURIComponent(hash);
        return decodeURIComponent(hash.substring(1));
    }


    /**
     * Clear the bookmark store
     */
    clear() {
        this.saveString(null);
    }


    /**
     * Save value according to key-value store convention
     * @param {string} key Key to the item
     * @param {string|null} value Item value, or null to clear the storage
     */
    save(key, value) {
        const _key = xw.requires(key);
        const _value = xw.requires(value);

        const _obj = _loadAsObject();

        if (_value !== null) {
            _obj[key] = value;
        } else {
            if (!_obj.hasOwnProperty(key)) return;
            delete _obj[key];
        }

        const jsonString = urlBase64.encode(_obj, {
            isPad: false,
        });
        this.saveString(jsonString);
    }



    /**
     * Load value from specific bookmark key (using key-value store convention)
     * @param {string} key Key to the item
     * @param {string|null} [altDefault=null] Default item value if not found
     * @return {string|null} Stored item
     */
    load(key, altDefault) {
        const _key = xw.requires(key);
        const _altDefault = xw.defaultable(altDefault, null);

        const obj = _loadAsObject();
        return xw.defaultable(obj[_key], _altDefault);
    }


    /**
     * Delete value under specific bookmark key (using key-value store convention)
     * @param {string} key Key to the item
     */
    delete(key) {
        this.save(key, null);
    }
}


const bookmarkStore = new XwBookmarkStore();
export default bookmarkStore;
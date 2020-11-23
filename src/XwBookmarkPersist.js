import xw from "./Xw";
import random from "./XwRandom";
import bookmarkStore from "./XwBookmarkStore";
import XwPersistable from "./XwPersistable";
import XwPrefixedPersistable from "./XwPrefixedPersistable";


/**
 * Create a new session ID
 * @private
 */
function _createSession() {
    return random.fullAlphanumString(8);
}


/**
 * Create a final key for given session and item key
 * @param {string} session Session ID to identify the session
 * @param {string} key Item key
 * @return {string} Corresponding final key
 * @private
 */
function _createKey(session, key) {
    return session + '.' + key;
}


/**
 * Key-value persistence storage utilizing bookmark and session storage
 * @property bookmarkKey The bookmark key to persist under
 * @class
 * @extends module.Persistable
 * @hideconstructor
 */
class XwBookmarkPersist extends XwPersistable {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.bookmarkKey = 'psession';
    }


    /**
     * If there is persisted data
     */
    hasData() {
        const _session = bookmarkStore.load(this.bookmarkKey);
        return _session !== null;
    }


    /**
     * Save persisted data
     * @param {string} key Item key
     * @param {string|null} value Value to be saved, or delete item when null
     */
    save(key, value) {
        const _key = xw.requires(key);
        const _value = xw.requires(value);

        // Get session, or create a new session if necessary
        let _session = bookmarkStore.load(this.bookmarkKey);
        if (_session === null) {
            if (_value === null) return;    // Shortcut exit
            _session = _createSession();
            bookmarkStore.save(this.bookmarkKey, _session);
        }

        // Save value
        const _finalKey = _createKey(_session, _key);
        if (_value !== null) {
            window.sessionStorage.setItem(_finalKey, _value);
        } else {
            window.sessionStorage.removeItem(_finalKey);
        }
    }


    /**
     * Load persisted data
     * @param {string} key Item key
     * @param {string|null} [altDefault=null] Default value to be returned if not found
     * @return {string|null} Value saved, or null if nothing saved
     */
    load(key, altDefault) {
        const _key = xw.requires(key);
        const _altDefault = xw.defaultable(altDefault, null);

        const _session = bookmarkStore.load(this.bookmarkKey);
        if (_session === null) return _altDefault;

        // Get value
        const _finalKey = _createKey(_session, _key);
        const ret = window.sessionStorage.getItem(_finalKey);
        if (ret === null) return _altDefault;
        return ret;
    }


    /**
     * Delete persisted data
     * @param {string} key Item key to be deleted
     */
    delete(key) {
        this.save(key, null);
    }


    /**
     * Get a sub-container with given prefix
     * @param {string} prefix Prefix of the container
     * @return {XwPersistable} A persistable interface
     */
    getContainer(prefix) {
        const _prefix = xw.requires(prefix);
        return new XwPrefixedPersistable(this, _prefix);
    }
}


const bookmarkPersist = new XwBookmarkPersist();
export default bookmarkPersist;
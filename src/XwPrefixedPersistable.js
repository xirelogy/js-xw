import XwPersistable from "./XwPersistable";
import PrivateProperties from "./internals/_privates";
import xw from "./Xw";

/**
 * @typedef XwPrefixedPersistable_Data
 * @property {XwPersistable} parent Parent persistence provider
 * @property {string} prefix Prefix of the container
 * @private
 */


/**
 * @type XwPrefixedPersistable_Data
 * @private
 */
const _init = {
    parent: null,
    prefix: '',
}


const _p = new PrivateProperties(_init);


/**
 * Create a prefixed key
 * @param {string} prefix Prefix of the container
 * @param {string} key Item key
 * @return {string} Effective key
 * @private
 */
function _createPrefixedKey(prefix, key) {
    return prefix + '.' + key;
}


/**
 * Prefixed persistence storage
 * @class
 * @alias module.PrefixedPersistable
 * @extends module.Persistable
 */
class XwPrefixedPersistable extends XwPersistable {
    /**
     * @constructor
     * @param {XwPersistable} parent Parent provider
     * @param {string} prefix Prefix of the container
     */
    constructor(parent, prefix) {
        const _parent = xw.requires(parent);
        const _prefix = xw.requires(prefix);

        super();

        /**
         * @type {XwPrefixedPersistable_Data}
         * @private
         */
        const _d = _p.access(this);
        _d.parent = _parent;
        _d.prefix = _prefix;
    }


    /**
     * Save persisted data
     * @param {string} key Item key
     * @param {string|null} value Value to be saved, or delete item when null
     */
    save(key, value) {
        const _key = xw.requires(key);
        const _value = xw.requires(value);

        /**
         * @type {XwPrefixedPersistable_Data}
         * @private
         */
        const _d = _p.access(this);
        const _finalKey = _createPrefixedKey(_d.prefix, _key);
        _d.parent.save(_finalKey, _value);
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

        /**
         * @type {XwPrefixedPersistable_Data}
         * @private
         */
        const _d = _p.access(this);
        const _finalKey = _createPrefixedKey(_d.prefix, _key);
        return _d.parent.load(_finalKey, _altDefault);
    }


    /**
     * Delete persisted data
     * @param {string} key Item key to be deleted
     */
    delete(key) {
        const _key = xw.requires(key);

        /**
         * @type {XwPrefixedPersistable_Data}
         * @private
         */
        const _d = _p.access(this);
        const _finalKey = _createPrefixedKey(_d.prefix, _key);
        _d.parent.delete(_finalKey);
    }
}


export default XwPrefixedPersistable;
const _store = {};


/**
 * @class _IntStorage
 * Internal storage
 * @private
 */
class _IntStorage {
    /**
     * @methodOf _IntStorage
     * Get or initialize a global storage with given name
     * @param {string} name Name of the global storage
     * @param {object} [prototype] Prototype of the global storage during initialization
     * @return {object} The corresponding global storage
     */
    getStore(name, prototype) {
        // Initialize if necessary
        if (typeof _store[name] === 'undefined') {
            _store[name] = prototype || {};
        }

        // Return
        return _store[name];
    }
}


const _storage = new _IntStorage();
export default _storage;

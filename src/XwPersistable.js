import xw from "./Xw";


/**
 * Required interface for key-value persistence
 * @class
 * @interface
 * @alias module.Persistable
 */
class XwPersistable {
    /**
     * Save persisted data
     * @param {string} key Item key
     * @param {string|null} value Value to be saved, or delete item when null
     */
    save(key, value) {
        xw.todo();
    }


    /**
     * Load persisted data
     * @param {string} key Item key
     * @param {string|null} [altDefault=null] Default value to be returned if not found
     * @return {string|null} Value saved, or null if nothing saved
     */
    load(key, altDefault) {
        xw.todo();
    }


    /**
     * Delete persisted data
     * @param {string} key Item key to be deleted
     */
    delete(key) {
        xw.todo();
    }
}


export default XwPersistable;
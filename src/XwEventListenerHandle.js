import PrivateProperties from "./internals/_privates";
import XwReleasable from "./XwReleasable";

/**
 * @typedef XwEventListenerHandle_Data
 * @property {XwEventListeners} parent Parent event listener
 * @property {function(Event)} fn Target function
 * @private
 */


/**
 * @type {XwEventListenerHandle_Data}
 * @private
 */
const _init = {
    parent: null,
    fn: null,
};


const _p = new PrivateProperties(_init);


/**
 * Event listener subscription handle
 * @class
 * @alias module.EventListenerHandle
 * @extends module.Releasable
 */
class XwEventListenerHandle extends XwReleasable {
    /**
     * @constructor
     * @param {XwEventListeners} parent Parent event listener
     * @param {function(Event)} fn Target function
     */
    constructor(parent, fn) {
        super();

        /**
         * @type {XwEventListenerHandle_Data}
         */
        const _d = _p.access(this);
        _d.parent = parent;
        _d.fn = fn;
    }


    /**
     * Release the handle
     */
    release() {
        /**
         * @type {XwEventListenerHandle_Data}
         */
        const _d = _p.access(this);
        _d.parent.unsubscribe(_d.fn);
    }
}


export default XwEventListenerHandle;
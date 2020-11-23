import PrivateProperties from "./internals/_privates";
import XwEventListenerHandle from "./XwEventListenerHandle";

/**
 * @typedef XwEventListeners_Data
 * @property {Array<function(Event)>} listeners Event listener functions
 * @private
 */


/**
 * @type {XwEventListeners_Data}
 * @private
 */
const _init = {
    listeners: [],
};


const _p = new PrivateProperties(_init);


/**
 * Manage event listeners and event dispatching
 * @class
 * @alias module.EventListeners
 */
class XwEventListeners {
    /**
     * @constructor
     */
    constructor() {
        /**
         * @type {XwEventListenerHandle_Data}
         */
        const _d = _p.access(this);
    }


    /**
     * Subscribe to listen for events
     * @param {function(Event)} fn Function to be called when event occurred
     * @return {XwEventListenerHandle} Handle to the current subscription
     */
    subscribe(fn) {
        /**
         * @type {XwEventListeners_Data}
         */
        const _d = _p.access(this);
        _d.listeners.push(fn);

        return new XwEventListenerHandle(this, fn);
    }


    /**
     * Unsubscribe given listener
     * @param {function(Event)} fn Function to be removed from listeners
     * @return {boolean} If removed
     */
    unsubscribe(fn) {
        /**
         * @type {XwEventListeners_Data}
         */
        const _d = _p.access(this);
        for (let i = 0; i < _d.listeners; ++i) {
            if (_d.listeners[i] !== fn) continue;
            _d.listeners.splice(i, 1);
            return true;
        }

        return false;
    }


    /**
     * Dispatch event to all subscribing listeners
     * @param {Event} ev Event to be dispatched
     */
    dispatch(ev) {
        /**
         * @type {XwEventListeners_Data}
         */
        const _d = _p.access(this);
        for (const fn of _d.listeners) {
            fn(ev);
        }
    }
}


export default XwEventListeners;
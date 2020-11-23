/**
 * Errors related to XMLHttpRequest
 * @property {XMLHttpRequest} xhr The associated XHR object
 * @class
 * @alias module.Xhr.Error
 * @abstract
 * @extends Error
 */
class XwXhrError extends Error {
    /**
     * @constructor
     * @param {string} message The error message
     * @param {XMLHttpRequest} xhr The associated XHR object
     */
    constructor(message, xhr) {
        super(message);
        this.xhr = xhr;
    }
}


export default XwXhrError;

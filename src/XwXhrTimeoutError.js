import i18n from "./XwI18n";
import XwXhrError from "./XwXhrError";

const _l = i18n.init('XwXhrTimeoutError');


/**
 * Error because the request had timeout
 * @class
 * @alias module.Xhr.TimeoutError
 * @extends module.Xhr.Error
 */
class XwXhrTimeoutError extends XwXhrError {
    /**
     * @constructor
     * @param {XMLHttpRequest} xhr The associated XHR object
     */
    constructor(xhr) {
        super(_l('Request timeout'), xhr);
    }
}


export default XwXhrTimeoutError;

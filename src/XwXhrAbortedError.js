import i18n from "./XwI18n";
import XwXhrError from "./XwXhrError";

const _l = i18n.init('XwXhrAbortedError');


/**
 * Error because the request had been aborted
 * @class
 * @alias module.Xhr.AbortedError
 * @extends module.Xhr.Error
 */
class XwXhrAbortedError extends XwXhrError {
    /**
     * @constructor
     * @param {XMLHttpRequest} xhr The associated XHR object
     */
    constructor(xhr) {
        super(_l('Request aborted'), xhr);
    }
}


export default XwXhrAbortedError

import i18n from "./XwI18n";
import XwXhrError from "./XwXhrError";

const _l = i18n.init('XwXhrNetworkError');


/**
 * Error because of network related failure
 * @class
 * @alias module.Xhr.NetworkError
 * @extends module.Xhr.Error
 */
class XwXhrNetworkError extends XwXhrError {
    /**
     * @constructor
     * @param {XMLHttpRequest} xhr The associated XHR object
     */
    constructor(xhr) {
        super(_l('Network error'), xhr);
    }
}


export default XwXhrNetworkError;
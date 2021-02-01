import i18n from "./XwI18n";
import strings from "./XwStrings";
import XwXhrError from "./XwXhrError";

const _l = i18n.init('XwXhrHttpError');


/**
 * Error due to HTTP status code is an error
 * @property {number} status The 3-digit HTTP status code
 * @property {string} statusText Description of the HTTP status code
 * @property {*} response Response body
 * @class
 * @alias module.Xhr.HttpError
 * @extends module.Xhr.Error
 */
class XwXhrHttpError extends XwXhrError {
    /**
     * @constructor
     * @param {XMLHttpRequest} xhr The associated XHR object
     * @param {number} status The 3-digit HTTP status code
     * @param {string} statusText Description of the HTTP status code
     * @param {*} response Response body
     */
    constructor(xhr, status, statusText, response) {
        super(strings.format(_l('Request failed with HTTP/{0}'), status), xhr);
        this.status = status;
        this.statusText = statusText;
        this.response = response;
    }
}


export default XwXhrHttpError;

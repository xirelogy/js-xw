import i18n from "./XwI18n";
import XwXhrError from "./XwXhrError";

const _l = i18n.init('XwXhrParseError');


/**
 * Error due to parsing
 * @property {string} format The format expected
 * @property {string} raw Raw data that is failed to be parsed
 * @class
 * @alias module.Xhr.ParseError
 * @extends module.Xhr.Error
 */
class XwXhrParseError extends XwXhrError {
    /**
     * @constructor
     * @param {XMLHttpRequest} xhr The associated XHR object
     * @param {string} format The format expected
     * @param {string} raw Raw data that is failed to be parsed
     */
    constructor(xhr, format, raw) {
        super(_l('Failed when parsing response'), xhr);
        this.format = format;
        this.raw = raw;
    }
}


export default XwXhrParseError;

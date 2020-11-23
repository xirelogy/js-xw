import XwXhrParseError from "./XwXhrParseError";
import XwXhrParseResponse from "./XwXhrParseResponse";


/**
 * Parser of XHR response expecting JSON
 * @property {boolean} isStrict If the parser is strict (causes exception if parsing failed)
 * @class
 * @alias module.Xhr.JsonParseResponse
 * @extends module.Xhr.ParseResponse
 */
class XwXhrJsonParseResponse extends XwXhrParseResponse {
    /**
     * @constructor
     * @param {boolean} isStrict If the parser is strict (causes exception if parsing failed)
     */
    constructor(isStrict) {
        super();
        this.isStrict = isStrict;
    }


    /**
     * Get the format that this parser support
     * @return {string}
     */
    getFormat() {
        return 'json';
    }


    /**
     * Parse the response
     * @param {XMLHttpRequest} xhr The associated XHR object
     * @param {string} text Original response text
     * @return {*} Parsed result
     */
    parse(xhr, text) {
        try {
            return JSON.parse(text);
        } catch (e) {
            if (this.isStrict) {
                throw new XwXhrParseError(xhr, this.getFormat(), text);
            }

            // Otherwise, fallback
            return text;
        }
    }
}


export default XwXhrJsonParseResponse;
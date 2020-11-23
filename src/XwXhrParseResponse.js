import xw from "./Xw";


/**
 * Parser of XHR response
 * @class
 * @alias module.Xhr.ParseResponse
 * @abstract
 */
class XwXhrParseResponse {
    /**
     * Get the format that this parser support
     * @return {string}
     * @abstract
     */
    getFormat() {
        xw.todo();
    }


    /**
     * Parse the response
     * @param {XMLHttpRequest} xhr The associated XHR object
     * @param {string} text Original response text
     * @return {*} Parsed result
     * @abstract
     */
    parse(xhr, text) {
        xw.todo();
    }
}


export default XwXhrParseResponse;
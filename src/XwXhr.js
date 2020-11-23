import xw from "./Xw";
import strings from "./XwStrings";
import XwXhrRequest from "./XwXhrRequest";


/**
 * XHR static interface
 * @class
 * @hideconstructor
 */
class XwXhr {
    /**
     * Make an XHR request
     * @param {object} args Arguments to the request
     * @param {string} [args.method='get'] Request method, case insensitive (GET/POST)
     * @param {string} args.url The URL to make the request
     * @param {object} [args.headers={}] Additional headers to be sent in the request
     * @param {object|XwXhrPostContent|null} [args.data=null] Data to be sent with the request.
     *        If data is object, then it will be the queries in a GET request, or it will be the
     *        form content in a POST request.
     * @param {number} [args.timeoutMs=0] Timeout for the request in milliseconds. When specified
     *        number is zero (or less) then there is no timeout.
     * @param {XwXhrParseResponse|null} [args.parseResponse=null] Specific response parser.
     * @param {boolean} [args.ignoreHttpError=false] If true, will ignore HTTP status error and
     *        treat the request as successful. (Warning: in this mode, caller will not be able
     *        to know the HTTP status returned)
     * @return {Promise<*>} Result of the request
     */
    async request(args) {
        // Process the arguments
        const _args = xw.requires(args);
        const _argsMethod = strings.toLowerCase(xw.defaultable(_args.method, 'get'));
        const _argsUrl = xw.requires(_args.url);
        const _argsHeaders = xw.defaultable(_args.headers, {});
        const _argsData = xw.defaultable(_args.data, null);
        const _argsTimeoutMs = xw.defaultable(_args.timeoutMs, 0);
        const _argsParseResponse = xw.defaultable(_args.parseResponse, null);
        const _argsIgnoreHttpError = xw.defaultable(_args.ignoreHttpError, false);

        // Construct the request object
        const requestObj = new XwXhrRequest(_argsUrl, _argsMethod);
        requestObj.headers = _argsHeaders;
        requestObj.data = _argsData;
        requestObj.timeoutMs = _argsTimeoutMs;
        requestObj.parseResponse = _argsParseResponse;
        requestObj.ignoreHttpError = _argsIgnoreHttpError;

        // And make the request
        return await requestObj.request();
    }
}


const xhr = new XwXhr();
export default xhr;
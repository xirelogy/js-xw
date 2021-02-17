import xw from "./Xw";
import i18n from "./XwI18n";
import PrivateProperties from "./internals/_privates";
import XwInvalidDataError from "./XwInvalidDataError";
import XwInvalidStateError from "./XwInvalidStateError";
import XwUnsupportedError from "./XwUnsupportedError";
import XwXhrPostContent from "./XwXhrPostContent";
import XwXhrHttpError from "./XwXhrHttpError";
import XwXhrTimeoutError from "./XwXhrTimeoutError";
import XwXhrAbortedError from "./XwXhrAbortedError";
import XwXhrNetworkError from "./XwXhrNetworkError";

const _l = i18n.init('XwXhr');


/**
 * The HTTP GET method
 * @type {string}
 * @private
 */
const METHOD_GET = 'get';

/**
 * The HTTP POST method
 * @type {string}
 * @private
 */
const METHOD_POST = 'post';


/**
 * @typedef XwXhrRequest_Data
 * @property {boolean} isRequested If the request had been made
 * @property {boolean} isRunning If the request is running
 * @private
 */


/**
 * @type {XwXhrRequest_Data}
 * @private
 */
const _init = {
    isRequested: false,
    isRunning: false,
};


const _p = new PrivateProperties(_init);


/**
 * Representation of a XML HTTP request asynchronously
 *
 * @property {string} url The URL to request from
 * @property {string} method Request method
 * @property {number} timeoutMs Timeout in milliseconds (enabled when value > 0)
 * @property {Object<string, string>} headers HTTP headers to be sent with the request
 * @property {object|XwXhrPostContent|null} data Data to be sent with the request.
 *            If data is object, then it will be the queries in a GET request, or it
 *            will be the form content in a POST request.
 * @property {XwXhrParseResponse|null} parseResponse Specific response parser.
 * @property {boolean} ignoreHttpError If HTTP status code error should be ignored
 * @class
 * @alias module.Xhr.Request
 */
class XwXhrRequest {
    /**
     * @constructor
     * @param {string} url The URL to make the request
     * @param {string} [method] Request method, case insensitive (GET/POST)
     */
    constructor(url, method) {
        const _url = xw.requires(url);
        const _method = xw.defaultable(method, METHOD_GET);

        this.url = _url;
        this.method = _method;
        this.timeoutMs = 0;
        this.headers = {};
        this.data = null;
        this.parseResponse = null;
        this.ignoreHttpError = false;

        /**
         * @type {XwXhrRequest_Data}
         * @private
         */
        const _d = _p.access(this);
        _d.isRequested = false;
        _d.isRunning = false;
    }


    /**
     * Make an XHR request
     * @return {Promise<*>} Result of the request
     */
    async request() {
        /**
         * @type {XwXhrRequest_Data}
         * @private
         */
        const _d = _p.access(this);

        if (_d.isRequested) throw new XwInvalidStateError(_l('already requested'));

        return new Promise((resolve, reject) => {
            _d.isRequested = true;

            // Create the underlying XHR object
            const xhr = new XMLHttpRequest();
            if (this.timeoutMs > 0) xhr.timeout = this.timeoutMs;

            // Handle successful XHR reply
            xhr.onload = () => {
                let response = xhr.responseText;

                // Try to parse the response
                if (this.parseResponse !== null) {
                    try {
                        response = this.parseResponse.parse(xhr, xhr.responseText);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                }

                // Handle HTTP status error
                if (!this.ignoreHttpError && xhr.status >= 400) {
                    _d.isRunning = false;
                    reject(new XwXhrHttpError(xhr, xhr.status, xhr.statusText, response));
                    return;
                }

                // Successful
                _d.isRunning = false;
                resolve(response);
            };

            // Handle timeout reply
            xhr.ontimeout = () => {
                _d.isRunning = false;
                reject(new XwXhrTimeoutError(xhr));
            };

            // Handle aborted request
            xhr.onabort = () => {
                _d.isRunning = false;
                reject(new XwXhrAbortedError(xhr));
            }

            // Handle failed XHR reply
            xhr.onerror = () => {
                _d.isRunning = false;
                reject(new XwXhrNetworkError(xhr));
            };

            // Prepare the request and process the payload
            let _url = this.url;
            let payload = null;

            // Process the data
            switch (this.method) {
                case METHOD_GET:
                    // HTTP/GET request, data is translated to queries
                    if (this.data !== null) {
                        if (typeof this.data !== 'object') throw new XwInvalidDataError();

                        let isFirstArg = true;
                        for (const key in this.data) {
                            if (!this.data.hasOwnProperty(key)) continue;

                            if (isFirstArg) {
                                isFirstArg = false;
                                _url += '?';
                            } else {
                                _url += '&';
                            }

                            _url += encodeURIComponent(key);
                            _url += '=';
                            _url += encodeURIComponent(this.data[key]);
                        }
                    }
                    xhr.open(this.method, _url, true);
                    break;

                case METHOD_POST:
                    xhr.open(this.method, _url, true);
                    if (this.data !== null) {
                        if (this.data instanceof XwXhrPostContent) {
                            payload = this.data.getPayload();
                            xhr.setRequestHeader('Content-type', this.data.getContentType());
                        } else {
                            if (typeof this.data != 'object') throw new XwInvalidDataError();

                            payload = new FormData();
                            for (const key in this.data) {
                                if (!this.data.hasOwnProperty(key)) continue;
                                payload.set(key, this.data[key]);
                            }
                        }
                    }
                    break;

                default:
                    throw new XwUnsupportedError(this.method, _l('request method'));
            }

            // Start the request
            _d.isRunning = true;

            // Accept all headers
            for (const headerName in this.headers) {
                if (!this.headers.hasOwnProperty(headerName)) continue;
                xhr.setRequestHeader(headerName, this.headers[headerName]);
            }

            // Send the request
            xhr.send(payload);
        });
    }
}


export default XwXhrRequest;
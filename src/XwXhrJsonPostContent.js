import XwXhrPostContent from "./XwXhrPostContent";


/**
 * Content that can be posted using XHR
 * @property {*} data The data (to be encoded to JSON) to be posted
 * @class
 * @alias module.Xhr.JsonPostContent
 * @extends module.Xhr.PostContent
 */
class XwXhrJsonPostContent extends XwXhrPostContent {
    /**
     * @constructor
     * @param {*} data The data (to be encoded to JSON) to be posted
     */
    constructor(data) {
        super();
        this.data = data;
    }


    /**
     * The MIME content type of the content to be posted
     * @return {string}
     */
    getContentType() {
        return 'application/json';
    }


    /**
     * The payload to be posted
     * @return {*}
     */
    getPayload() {
        return JSON.stringify(this.data);
    }
}


export default XwXhrJsonPostContent;
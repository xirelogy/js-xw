import xw from "./Xw";


/**
 * Content that can be posted using XHR
 * @class
 * @alias module.Xhr.PostContent
 * @abstract
 */
class XwXhrPostContent {
    /**
     * The MIME content type of the content to be posted
     * @return {string}
     * @abstract
     */
    getContentType() {
        xw.todo();
    }


    /**
     * The payload to be posted
     * @return {*}
     * @abstract
     */
    getPayload() {
        xw.todo();
    }
}


export default XwXhrPostContent;
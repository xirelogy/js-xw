import i18n from "./XwI18n";

const _l = i18n.init('XwTimeoutError');


/**
 * Error due to timeout
 * @class
 * @alias module.TimeoutError
 * @extends Error
 */
class XwTimeoutError extends Error {
    /**
     * @constructor
     */
    constructor() {
        super(_l('Timeout'));
    }
}


export default XwTimeoutError;
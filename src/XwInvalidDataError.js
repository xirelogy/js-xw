import i18n from "./XwI18n";

const _l = i18n.init('XwInvalidDataError');


/**
 * Error due to invalid data
 * @class
 * @alias module.InvalidDataError
 * @extends Error
 */
class XwInvalidDataError extends Error {
    /**
     * @constructor
     */
    constructor() {
        super(_l('Invalid data'));
    }
}


export default XwInvalidDataError;
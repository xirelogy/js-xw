import xw from "./Xw";
import i18n from "./XwI18n";
import strings from "./XwStrings";

const _l = i18n.init('XwInvalidStateError');


/**
 * Format error message
 * @param {string|null} reason Reason related to the invalid state
 * @return {string}
 * @private
 */
function _formatMessage(reason) {
    if (reason !== null) {
        return strings.format(_l('Invalid state - {0}'), reason);
    } else {
        return _l('Invalid state');
    }
}


/**
 * Error due to invalid state
 * @property {string|null} reason Reason related to the invalid state, if any
 * @class
 * @alias module.InvalidStateError
 * @extends Error
 */
class XwInvalidStateError extends Error {
    /**
     * @constructor
     * @param {string} [reason] Reason related to the invalid state
     */
    constructor(reason) {
        const _reason = xw.defaultable(reason);
        super(_formatMessage(_reason));
        this.reason = _reason;
    }
}


export default XwInvalidStateError;
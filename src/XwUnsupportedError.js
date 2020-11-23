import xw from "./Xw";
import i18n from "./XwI18n";
import strings from "./XwStrings";

const _l = i18n.init('XwUnsupportedError');


/**
 * Format error message
 * @param {*|null} value The value that is not supported
 * @param {string|null} usage The related usage for the unsupported error
 * @return {string}
 * @private
 */
function _formatMessage(value, usage) {
    if (value !== null) {
        if (usage !== null) {
            return strings.format(_l('\'{0}\' is not supported for {1}'), value, usage);
        } else {
            return strings.format(_l('\'{0}\' is not supported'), value);
        }
    } else {
        if (usage !== null) {
            return strings.format(_l('Unsupported for {0}'), usage);
        } else {
            return _l('Unsupported');
        }
    }
}


/**
 * Unsupported error
 * @property {*|null} value The unsupported value, if available
 * @property {string|null} usage The related usage for the unsupported error
 * @class
 * @alias module.UnsupportedError
 * @extends Error
 */
class XwUnsupportedError extends Error {
    /**
     * @constructor
     * @param {*} [value] The value that is not supported
     * @param {string} [usage] The related usage for the unsupported error
     */
    constructor(value, usage) {
        const _value = xw.defaultable(value);
        const _usage = xw.defaultable(usage);
        super(_formatMessage(_value, _usage));

        this.value = _value;
        this.usage = _usage;
    }
}


export default XwUnsupportedError;
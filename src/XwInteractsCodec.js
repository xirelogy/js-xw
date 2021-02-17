import i18n from "./XwI18n";
import xw from "./Xw";


const _l = i18n.init('XwInteractsCodec');


/**
 * Interactions listener target
 * @class
 * @interface
 * @alias module.InteractsListener
 */
class XwInteractsCodec {
    /**
     * Validation function
     * @param {*} value Input value
     * @param {XwInteractsState} state
     * @return {*} Validated value
     */
    validate(value, state) {
        xw.todo();
    }


    /**
     * Formatting function
     * @param {*} value Input value
     * @param {XwInteractsState} state
     * @return {*} Formatted value
     */
    format(value, state) {
        xw.todo();
    }
}


export default XwInteractsCodec;

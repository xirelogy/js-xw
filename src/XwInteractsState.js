import i18n from "./XwI18n";
import xw from "./Xw";


const _l = i18n.init('XwInteractsState');


/**
 * Interactions control state
 * @class
 * @interface
 * @alias module.InteractsState
 * @property {string} scene Current scene when the function is invoked
 * @property {*|null} data Associated data
 * @property {boolean} isForceFormat If format should be forced
 */
class XwInteractsState {

    /**
     * Create a validation error
     * @param {string} [message] Error message
     */
    createValidationError(message) {
        const _message = xw.defaultable(message, _l('Validation failed'));
        return new Error(_message);
    }


    /**
     * Default validation function
     * @param {*} value Input value
     * @return {*} Validated value
     */
    defaultValidate(value) {
        xw.todo();
    }


    /**
     * Default formatting function
     * @param {*} value Underlying value
     * @return {*} Formatted value
     */
    defaultFormat(value) {
        xw.todo();
    }
}


export default XwInteractsState;
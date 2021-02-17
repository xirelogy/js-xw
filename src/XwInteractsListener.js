import i18n from "./XwI18n";
import xw from "./Xw";


const _l = i18n.init('XwInteractsListener');


/**
 * Interactions listener target
 * @class
 * @interface
 * @alias module.InteractsListener
 */
class XwInteractsListener {

    /**
     * Handover event to the listener
     * @param {string} scene Event scene
     * @param {Event} ev Event argument
     */
    onEvent(scene, ev) {
        xw.todo();
    }
}


export default XwInteractsListener;

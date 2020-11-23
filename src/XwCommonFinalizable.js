import xw from "./Xw";
import PrivateProperties from "./internals/_privates";
import XwFinalizable from "./XwFinalizable";
import XwInvalidDataError from "./XwInvalidDataError";
import logger from "./XwLogger";


/**
 * @typedef XwCommonFinalizable_Data
 * @property {*|null} data Associated state data, if any
 * @property {function(*)|null} onInit Initialization function
 * @property {function(*)|null} onFinal Finalization function
 * @property {function(*)|null} onAsyncFinal Asynchronous finalization function
 * @property {boolean} isFinal If already finalized
 * @private
 */


/**
 * @type XwCommonFinalizable_Data
 * @private
 */
const _init = {
    data: null,
    onInit: null,
    onFinal: null,
    onAsyncFinal: null,
    isFinal: false,
};

const _p = new PrivateProperties(_init);


/**
 * A common finalizable
 * @class
 * @alias module.CommonFinalizable
 * @extends module.Finalizable
 */
class XwCommonFinalizable extends XwFinalizable {
    /**
     * @constructor
     * @param {object} args Arguments
     * @param {*|null} [args.data=null] Associated state data, if any
     * @param {function(*)|null} [args.onInit=null] Initialization function
     * @param {function(*)|null} [args.onFinal=null] Finalization function
     * @param {function(*)|null} [args.onAsyncFinal=null] Asynchronous finalization function
     */
    constructor(args) {
        super();

        const _args = xw.requires(args);

        /**
         * @type XwCommonFinalizable_Data
         */
        const _d = _p.access(this);
        _d.data = xw.defaultable(_args.data);
        _d.onInit = xw.defaultable(_args.onInit);
        _d.onFinal = xw.defaultable(_args.onFinal);
        _d.onAsyncFinal = xw.defaultable(_args.onAsyncFinal);
        _d.isFinal = false;

        if (_d.onFinal === null || _d.onAsyncFinal === null) {
            throw new XwInvalidDataError();
        }

        if (_d.onInit !== null) {
            _d.onInit(_d.data);
        }
    }


    /**
     * Dismiss any finalization
     */
    dismiss() {
        /**
         * @type XwCommonFinalizable_Data
         */
        const _d = _p.access(this);
        _d.isFinal = true;
    }


    /**
     * Finalize
     */
    final() {
        /**
         * @type XwCommonFinalizable_Data
         */
        const _d = _p.access(this);

        if (_d.isFinal) return;
        _d.isFinal = true;

        if (_d.onFinal !== null) {
            try {
                _d.onFinal(_d.data);
            } catch (e) {
                logger.warn('Suppressed error in final()', e);
            }
        }
    }


    /**
     * Finalize (asynchronously)
     * @return {Promise<void>}
     */
    async asyncFinal() {
        /**
         * @type XwCommonFinalizable_Data
         */
        const _d = _p.access(this);

        if (_d.isFinal) return;
        _d.isFinal = true;

        if (_d.onAsyncFinal !== null) {
            try {
                await _d.onAsyncFinal(_d.data);
            } catch (e) {
                logger.warn('Suppressed error in final()', e);
            }
        }
    }
}


export default XwCommonFinalizable;
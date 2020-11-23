import xw from "./Xw";
import axw from "./XwAsync";
import PrivateProperties from "./internals/_privates";
import XwFinalizable from "./XwFinalizable";


/**
 * @typedef XwMergedFinalizable_Data
 * @property {XwFinalizable[]} finalizables Finalizables to be merged
 * @property {boolean} isParallelAsync If asynchronous finalization is executed in parallel
 * @private
 */


/**
 * @type {XwMergedFinalizable_Data}
 * @private
 */
const _init = {
    finalizables: [],
    isParallelAsync: true,
};


const _p = new PrivateProperties(_init);


/**
 * Merge multiple finalizables into one
 * @class
 * @alias module.MergedFinalizable
 * @extends module.Finalizable
 */
class XwMergedFinalizable extends XwFinalizable {
    /**
     * @constructor
     * @param {XwFinalizable[]} finalizables Finalizables to be merged
     * @param {object} [options] Options
     * @param {boolean} [options.isParallelAsync=true] If asynchronous finalization is executed in parallel
     */
    constructor(finalizables, options) {
        super();

        const _finalizables = xw.requires(finalizables);
        const _options = xw.defaultable(options, {});
        const _optionsIsParallelAsync = xw.defaultable(_options.isParallelAsync, true);

        /**
         * @type XwMergedFinalizable_Data
         */
        const _d = _p.access(this);
        _d.finalizables = _finalizables;
        _d.isParallelAsync = _optionsIsParallelAsync;
    }


    /**
     * Dismiss any finalization
     */
    dismiss() {
        /**
         * @type XwMergedFinalizable_Data
         */
        const _d = _p.access(this);

        for (const finalizable of _d.finalizables) {
            finalizable.dismiss();
        }
    }


    /**
     * Finalize
     */
    final() {
        /**
         * @type XwMergedFinalizable_Data
         */
        const _d = _p.access(this);

        for (const finalizable of _d.finalizables) {
            finalizable.final();
        }
    }


    /**
     * Finalize (asynchronously)
     * @return {Promise<void>}
     */
    async asyncFinal() {
        /**
         * @type XwMergedFinalizable_Data
         */
        const _d = _p.access(this);

        if (_d.isParallelAsync) {
            // Execute in parallel
            const promises = [];
            for (const finalizable of _d.finalizables) {
                promises.push(finalizable.asyncFinal());
            }
            await axw.waitAll(promises, {
                ignoreErrors: true,
            });
        } else {
            // Execute in sequence (non-parallel)
            for (const finalizable of _d.finalizables) {
                await finalizable.asyncFinal();
            }
        }
    }
}


export default XwMergedFinalizable;
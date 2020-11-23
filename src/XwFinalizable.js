import xw from "./Xw";


/**
 * Anything that is finalizable
 * @class
 * @interface
 * @alias module.Finalizable
 */
class XwFinalizable {
    /**
     * Dismiss any finalization
     */
    dismiss() {
        xw.todo();
    }


    /**
     * Finalize
     */
    final() {
        xw.todo();
    }


    /**
     * Finalize (asynchronously)
     * @return {Promise<void>}
     */
    async asyncFinal() {
        xw.todo();
    }
}


export default XwFinalizable;
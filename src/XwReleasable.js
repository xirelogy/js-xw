import xw from "./Xw";


/**
 * Anything that is releasable
 * @class
 * @interface
 * @alias module.Releasable
 */
class XwReleasable {
    /**
     * Release
     */
    release() {
        xw.todo();
    }
}


export default XwReleasable;
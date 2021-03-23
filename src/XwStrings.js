import xw from "./Xw";


/**
 * Convert anything to a string
 * @param v Target to be converted
 * @return {string} The equivalent string
 * @private
 */
function _getString(v) {
    if (typeof v === 'string') return v;

    return String(v);
}


/**
 * Common string utilities
 * @class
 * @hideconstructor
 */
class XwStrings {
    /**
     * Check if given target (assumed to be a string) is empty
     * @param {*} v Target value
     * @return {boolean} If target is empty. The definition of empty is that
     *         the target is null, or is a empty string, or trimmed to an
     *         empty string.
     */
    isEmpty(v) {
        if (!xw.isDefined(v)) return true;
        const _v = xw.requires(v);
        if (v === null) return true;
        if (this.trim(v) === '') return true;
        return false;
    }


    /**
     * Trim a string
     * @param {*} v Target value
     * @return {string|null} Trimmed string
     */
    trim(v) {
        if (v === null) return null;
        return _getString(v).trim();
    }


    /**
     * Convert string to lowercase
     * @param {*} v Target value
     * @return {string|null} Converted string
     */
    toLowerCase(v) {
        if (v === null) return null;
        return _getString(v).toLowerCase();
    }


    /**
     * Convert string to uppercase
     * @param {*} v Target value
     * @return {string|null} Converted string
     */
    toUpperCase(v) {
        if (v === null) return null;
        return _getString(v).toUpperCase();
    }


    /**
     * Pad the string with padding character until it is at least of given length
     * @param {string} v
     * @param {number} length
     * @param {string} pad
     */
    leftPad(v, length, pad) {
        const _v = xw.requires(v);
        const _length = xw.requires(length);
        const _pad = xw.requires(pad);

        let ret = _getString(_v);
        while (ret.length < length) {
            ret = pad + ret;
        }

        return ret;
    }


    /**
     * Format into a string, placing items to the corresponding placeholders
     * @param {string} format The format string with placeholders, whereby
     *        each placeholder is a number in braces, e.g. '{0}' will indicate
     *        argument 0.
     * @param {*} args Arguments to the placed
     */
    format(format, ...args) {
        const _format = xw.requires(format);

        return _format.replace(/{(\d+)}/g, (match, num) => {
            const arg = args[num];
            return xw.isDefined(arg) ? arg : match;
        });
    }
}


const strings = new XwStrings();
export default strings;
import xw from "./Xw"
import i18n from "./XwI18n";

const _l = i18n.init('XwRandom');


/**
 * Random related utilities
 * @class
 * @hideconstructor
 */
class XwRandom {
    /**
     * Generate a time related nonce
     * @return number
     */
    nonce() {
        return (new Date()).getTime();
    }


    /**
     * Create a random string with given length, only within given character set
     * @param {number} length The desire length of the string
     * @param {string} charset The character set to pick from
     * @return {string} The random string
     */
    string(length, charset) {
        const _length = xw.requires(length);
        const _charset = xw.requires(charset);

        if (_charset.length <= 0) throw new Error(_l('Character set must not be empty'));

        let ret = '';
        for (let i = 0; i < _length; ++i) {
            const r = this.number(0, _charset.length - 1);
            ret += _charset.charAt(r);
        }

        return ret;
    }


    /**
     * Create a random number between the min/max range
     * @param {number} min The minimum number
     * @param {number} max The maximum number
     * @return {number} The result random
     */
    number(min, max) {
        const _min = xw.requires(min);
        const _max = xw.requires(max);

        if (_min > _max) throw new Error(_l('\'min\' must be smaller than \'max\''));

        return Math.floor(Math.random() * (_max - _min)) + _min;
    }


    /**
     * Random hex string
     * @param {number} length The desire length of the string
     * @return {string} The random string
     */
    hexString(length) {
        return this.string(length, '0123456789abcdef');
    }


    /**
     * Random lowercase alpha-numeric string
     * @param {number} length The desire length of the string
     * @return {string} The random string
     */
    lowerAlphanumString(length) {
        return this.string(length, '0123456789abcdefghijklmnopqrstuvwxyz');
    }


    /**
     * Random uppercase alpha-numeric string
     * @param {number} length The desire length of the string
     * @return {string} The random string
     */
    upperAlphanumString(length) {
        return this.string(length, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }


    /**
     * Random full alpha-numeric string
     * @param {number} length The desire length of the string
     * @return {string} The random string
     */
    fullAlphanumString(length) {
        return this.string(length, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
}


const random = new XwRandom();
export default random;

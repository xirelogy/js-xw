import xw from "./Xw";

// Based on: http://www.webtoolkit.info/


/**
 * The encoding character set
 * @type {string}
 * @private
 */
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';


/**
 * Encode the string as UTF-8
 * @param {string} v Input value
 * @return {string} Encoded string
 * @private
 */
function _utf8Encode(v) {
    let _v = v.replace(/\r\n/g, '\n');
    let ret = '';

    for (let n = 0; n < _v.length; ++n)
    {
        const c = _v.charCodeAt(n);
        if (c < 128)
        {
            ret += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048))
        {
            ret += String.fromCharCode((c >> 6) | 192);
            ret += String.fromCharCode((c & 63) | 128);
        }
        else
        {
            ret += String.fromCharCode((c >> 12) | 224);
            ret += String.fromCharCode(((c >> 6) & 63) | 128);
            ret += String.fromCharCode((c & 63) | 128);
        }
    }

    return ret;
}


/**
 * Decode the string as UTF-8
 * @param {string} v UTF-8 encoded string
 * @return {string} Decoded string
 * @private
 */
function _utf8Decode(v) {
    let ret = '';
    let i = 0;

    while (i < v.length) {
        const c1 = v.charCodeAt(i);
        if (c1 < 128)
        {
            ret += String.fromCharCode(c1);
            i += 1;
        }
        else if ((c1 > 191) && (c1 < 224))
        {
            const c2 = v.charCodeAt(i + 1);
            ret += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else
        {
            const c2 = v.charCodeAt(i + 1);
            const c3 = v.charCodeAt(i + 2);
            ret += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return ret;
}


/**
 * URL-safe base64 variant
 * @class
 * @hideconstructor
 */
class XwUrlBase64 {
    /**
     * Encode according to base64 (URL-safe variant)
     * @param {object|string} v Input
     * @param {object} [options] Encoding options
     * @param {boolean} [options.isPad=true] If base64 padding is used
     * @return {string} Encoded string
     */
    encode(v, options) {
        let _v = xw.requires(v);
        const _options = xw.defaultable(options, {});
        const _optionsIsPad = xw.defaultable(_options.isPad, true);

        // Convert objects to string
        if (typeof _v === 'object') {
            _v = JSON.stringify(_v);
        }

        _v = _utf8Encode(_v);

        let ret = '';
        let i = 0;

        while (i < _v.length) {
            const chr1 = _v.charCodeAt(i++);
            const chr2 = _v.charCodeAt(i++);
            const chr3 = _v.charCodeAt(i++);

            let enc1 = chr1 >> 2;
            let enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            let enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = 64;
                enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            ret += CHARSET.charAt(enc1) + CHARSET.charAt(enc2) + CHARSET.charAt(enc3) + CHARSET.charAt(enc4);
        }

        // Remove padding if required
        if (!_optionsIsPad) {
            while (ret.length > 0) {
                if (ret[ret.length - 1] !== '=') break;
                ret = ret.substring(0, ret.length - 1);
            }
        }

        return ret;
    }


    /**
     * Decode according to base64 (URL-safe variant)
     * @param {string} v Encoded string
     * @return {string} Decoded string
     */
    decode(v) {
        // Fill up padding automatically
        while ((v.length % 4) !== 0) v += '=';

        // Drop other strings
        v = v.replace(/[^A-Za-z0-9\-_=]/g, '');

        // Loop through
        let ret = '';
        let i = 0;
        while (i < v.length) {
            const enc1 = CHARSET.indexOf(v.charAt(i++));
            const enc2 = CHARSET.indexOf(v.charAt(i++));
            const enc3 = CHARSET.indexOf(v.charAt(i++));
            const enc4 = CHARSET.indexOf(v.charAt(i++));

            const chr1 = (enc1 << 2) | (enc2 >> 4);
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            const chr3 = ((enc3 & 3) << 6) | enc4;

            ret += String.fromCharCode(chr1);
            if (enc3 !== 64) ret += String.fromCharCode(chr2);
            if (enc4 !== 64) ret += String.fromCharCode(chr3);
        }

        return _utf8Decode(ret);
    }
}


const urlBase64 = new XwUrlBase64();
export default urlBase64;
import i18n from "./XwI18n"
import random from "./XwRandom";
import XwTimeoutError from "./XwTimeoutError";

const _l = i18n.init('Xw');


/**
 * Custom CSS style sheet
 * @type {CSSStyleSheet|null}
 * @private
 */
let _customCss = null;


/**
 * Custom CSS names inserted
 * @type {object}
 * @private
 */
let _customCssNames = {};


/**
 * Common functionalities for the XW javascript frontend framework
 * @class
 * @hideconstructor
 */
class Xw {
    /**
     * Deep clone an item
     * @template T
     * @param {T} v Value to be cloned
     * @return {T} Cloned value
     */
    deepClone(v) {
        if (v === null) return null;
        if (typeof v !== 'object') return v;

        const ret = {};
        for (const k in v) {
            if (!v.hasOwnProperty(k)) continue;
            ret[k] = this.deepClone(v[k]);
        }

        return ret;
    }


    /**
     * Flatten an item, normally for debugging display purpose
     * @param {*} v Value to be flatten
     * @return {*}
     */
    flatten(v) {
        return JSON.parse(JSON.stringify(v));
    }


    /**
     * Check if given item is defined
     * @param {*} v Item to be checked
     * @return {boolean} If the item is defined
     */
    isDefined(v) {
        return typeof v !== 'undefined';
    }


    /**
     * Ensure that the given item is provided
     * @template T
     * @param {T} v Item required
     * @return {T} Item as returned
     */
    requires(v) {
        if (!this.isDefined(v)) throw new Error(_l('Required argument undefined'));
        return v;
    }


    /**
     * Get the item, or return an alternative fallback if item unavailable
     * @template T
     * @param {T} v Item to be checked
     * @param {T|null} [alt=null] Alternative fallback value if item unavailable
     * @returns {T|null} Item as returned, or its alternative default
     */
    defaultable(v, alt) {
        const _alt = this.isDefined(alt) ? alt : null;
        if (!this.isDefined(v)) return _alt;
        return v;
    }


    /**
     * Build a URL using given base and queries
     * @param {string} base The base path of the URL
     * @param {object} [queries] Queries to the URL
     * @param {string} [bookmark] Bookmark of the URL
     */
    buildUrl(base, queries, bookmark) {
        let ret = base;
        if (!this.isDefined(queries)) return ret;

        let isFirst = true;
        for (const key in queries) {
            const outKey = key.trim();
            if (outKey === null || outKey === '') continue;

            const value = queries[key].trim();

            if (isFirst) {
                ret += '?';
                isFirst = false;
            } else {
                ret += '&';
            }

            if (!this.isDefined(value)) {
                ret += encodeURIComponent(outKey);
            } else {
                ret += encodeURIComponent(outKey) + '=' + encodeURIComponent(value);
            }
        }

        if (this.isDefined(bookmark)) {
            ret += '#' + bookmark;
        }

        return ret;
    }


    /**
     * Cause an error for function not implemented
     * @throws Error
     */
    todo() {
        throw new Error(_l('Not implemented'));
    }


    /**
     * Try to read cookie with given key
     * @param {string} key The cookie key
     * @param {string|null} [defaultValue=null] Default value if not matched
     * @return {string|null} The corresponding cookie value
     */
    readCookie(key, defaultValue) {
        const _key = this.requires(key);
        const _defaultValue = this.defaultable(defaultValue, null);
        const matched = document.cookie.match('(^|;)\\s*' + encodeURIComponent(_key) + '\\s*=\\s*([^;]+)');
        if (!matched) return _defaultValue;

        return matched.pop();
    }


    /**
     * Defer execution of function until document is ready
     * @param {function()} fn
     */
    onDocumentReady(fn) {
        const _fn = this.requires(fn);

        if (document.readyState === 'complete') {
            _fn();
        } else {
            document.addEventListener('readystatechange', (ev) => {
                if (document.readyState !== 'complete') return;
                _fn();
            });
        }
    }


    /**
     * Load javascript from given source
     * @param {string} src URL to the javascript
     * @param {object} [options] Options
     * @param {number} [options.timeoutMs=null] Timeout in milliseconds, do not timeout if not specified
     * @return {Promise<void>}
     */
    async loadJavascript(src, options) {
        const _src = this.requires(src);
        const _options = this.defaultable(options, {});
        const _optionsTimeoutMs = this.defaultable(_options.timeoutMs);

        return new Promise((resolve, reject) => {

            const scriptElement = document.createElement('script');
            scriptElement.async = true;
            scriptElement.src = _src;

            // Handle events
            scriptElement.onload = () => {
                resolve();
            }
            scriptElement.onreadystatechange = () => {
                resolve();
            }
            scriptElement.onerror = (ev) => {
                delete window[_callbackName];
                reject(new Error(_l('Error while loading the javascript')));
            };

            // Handle timeout
            if (_optionsTimeoutMs > 0) {
                setTimeout(() => {
                    delete window[_callbackName];
                    reject(new XwTimeoutError());
                }, _optionsTimeoutMs);
            }

            document.body.appendChild(scriptElement);
        })
    }


    /**
     * Load JSON from given source using JSONP
     * @param {string} src URL to the JSON
     * @param {object} [options] Options
     * @param {string} [options.callbackArg='callback'] Argument name for the callback query
     * @param {number} [options.timeoutMs=null] Timeout in milliseconds, do not timeout if not specified
     * @return {Promise<*>}
     */
    async loadJsonp(src, options) {
        const _src = this.requires(src);
        const _options = this.defaultable(options, {});
        const _optionsCallbackArg = this.defaultable(_options.callbackArg, 'callback');
        const _optionsTimeoutMs = this.defaultable(_options.timeoutMs);

        return new Promise((resolve, reject) => {

            const _callbackName = 'xwcb_' + random.lowerAlphanumString(8);

            // Receive the callback
            window[_callbackName] = (data) => {
                delete window[_callbackName];
                resolve(data);
            }

            // Handle timeout
            if (_optionsTimeoutMs > 0) {
                setTimeout(() => {
                    setTimeout(() => {
                        // Only delete it very long after
                        delete window[_callbackName];
                    }, 600000 /* 10 minutes */);
                    reject(new XwTimeoutError());
                }, _optionsTimeoutMs);
            }

            const _parsedSrc = new URL(_src, window.location.origin);
            _parsedSrc.searchParams.append(_optionsCallbackArg, _callbackName);

            const scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.async = true;
            scriptElement.src = _parsedSrc.href;

            scriptElement.onerror = (ev) => {
                delete window[_callbackName];
                reject(new Error(_l('Error while loading the JSONP')));
            };

            document.getElementsByTagName('head')[0].appendChild(scriptElement);
        });
    }


    /**
     * Access to custom CSS
     * @return {CSSStyleSheet}
     */
    getCustomCss() {
        if (_customCss !== null) return _customCss;

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);

        _customCss = style.sheet;
        return _customCss;
    }


    /**
     * Insert a custom CSS (if not already inserted)
     * @param {string} name
     * @param {string} rule
     */
    insertCustomCss(name, rule) {
        if (this.isDefined(_customCssNames[name])) return;

        const customCss = this.getCustomCss();
        customCss.insertRule(rule);
        _customCssNames[name] = rule;
    }
}


const xw = new Xw();
export default xw;
import xw from "./Xw";
import logger from "./XwLogger";
import XwTimeoutError from "./XwTimeoutError";


/**
 * Implementation for the wait loop
 * @param {function():boolean} checkFn Check function
 * @param {number} sleepMs Time to sleep between calls
 * @return {Promise<void>}
 * @private
 */
async function _waitFor(checkFn, sleepMs) {
    while (true) {
        if (checkFn()) return;
        await axw.sleep(sleepMs);
    }
}


/**
 * Utilities to support asynchronous operations
 * @class
 * @hideconstructor
 */
class XwAsync {
    /**
     * Fork execution of function
     * @param {function()} fn Function to be executed
     */
    fork(fn) {
        const _fn = xw.requires(fn);

        setTimeout(_fn, 0);
    }


    /**
     * Pause current execution for given time
     * @param {number} ms Milliseconds to pause
     * @return {Promise<void>}
     */
    async sleep(ms) {
        const _ms = xw.requires(ms);

        return new Promise((resolve) => {
            setTimeout(resolve, _ms);
        })
    }


    /**
     * Wait for the given condition to be fulfilled
     * @param {function():boolean} checkFn Check function to check for the condition, return
     *        if the condition is fulfilled
     * @param {object} [options] Optional options
     * @param {number} [options.sleepMs=10] Time to sleep in between checks, in milliseconds
     * @param {number} [options.timeoutMs=null] Timeout in milliseconds, do not timeout if not specified
     * @return {Promise<void>}
     */
    async waitFor(checkFn, options) {
        const _checkFn = xw.requires(checkFn);
        const _options = xw.defaultable(options, {});
        const _optionsSleepMs = xw.defaultable(_options.sleepMs, 10);
        const _optionsTimeoutMs = xw.defaultable(_options.timeoutMs);

        return new Promise((resolve, reject) => {
            // Handle timeout
            if (_optionsTimeoutMs > 0) {
                setTimeout(() => {
                    reject(new XwTimeoutError());
                }, _optionsTimeoutMs);
            }

            // Loop and check
            _waitFor(_checkFn, _optionsSleepMs).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
    }


    /**
     * Wait until all of the promises had been fulfilled
     * @param {Promise[]} promises Promises to be wait on
     * @param {object} [options] Optional options
     * @param {boolean} [options.ignoreErrors=false] Ignore errors from the promises
     * @param {number} [options.timeoutMs=null] Timeout in milliseconds, do not timeout if not specified
     * @return {Promise<void>}
     */
    async waitAll(promises, options) {
        const _promises = xw.requires(promises);
        const _options = xw.defaultable(options, {});
        const _optionsIgnoreErrors = xw.defaultable(_options.ignoreErrors, false);
        const _optionsTimeoutMs = xw.defaultable(_options.timeoutMs);

        return new Promise((resolve, reject) => {
            const _total = _promises.length;
            if (_total <= 0) {
                resolve();
                return;
            }

            let _completed = 0;
            for (const promise of _promises) {
                promise.then(() => {
                    _completed += 1;
                    if (_completed >= _total) resolve();
                }).catch((e) => {
                    if (_optionsIgnoreErrors) {
                        logger.warn('XwAsync.waitAll ignored error', {e: e});
                        _completed += 1;
                        if (_completed >= _total) resolve();
                        return;
                    }
                    reject(e);
                });
            }

            // Handle timeout
            if (_optionsTimeoutMs > 0) {
                setTimeout(() => {
                    reject(new XwTimeoutError());
                }, _optionsTimeoutMs);
            }
        });
    }
}


const axw = new XwAsync();
export default axw;
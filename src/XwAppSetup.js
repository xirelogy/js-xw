import xw from "./Xw";
import axw from "./XwAsync";
import random from "./XwRandom";
import logger from "./XwLogger";
import XwInvalidStateError from "./XwInvalidStateError";


/**
 * All provided items
 * @type {Map<string, boolean>}
 * @private
 */
const _provideds = new Map();

/**
 * All initialization providers
 * @type {Map<string, XwAppSetup_Init>}
 * @private
 */
const _providers = new Map();

/**
 * Items still pending initialization
 * @type {Map<string, boolean>}
 * @private
 */
const _pendings = new Map();

/**
 * If ready is already defined
 * @type {boolean}
 * @private
 */
let _isReadyDefined = false;

/**
 * Handle for failed initialization
 * @type {function(Error, string[])}
 * @private
 */
let _onInitFailed = (e, provides) => {
    logger.warn('Initialization failed unexpectedly!', {
        provides: provides,
    });
};


/**
 * Initialization handle
 * @property {function()} fn Initialization function
 * @property {string[]} provides Provided items after this initialization
 * @property {string[]} depends Dependencies for this initialization
 * @property {boolean} isCompleted If the initialization had completed
 * @property {boolean} isRunning If the initialization is running
 * @private
 */
class XwAppSetup_Init {
    /**
     * Constructor
     * @param {function()} fn Initialization function
     * @param {string[]} provides Provided items after this initialization
     * @param {string[]} depends Dependencies for this initialization
     */
    constructor(fn, provides, depends) {
        this.fn = fn;
        this.provides = provides;
        this.depends = depends;
        this.isCompleted = false;
        this.isRunning = false;
    }


    /**
     * Check if dependencies fulfilled
     * @return {boolean}
     */
    isDependenciesFulfilled() {
        for (const depend of this.depends) {
            if (!_provideds.has(depend)) return false;
        }

        return true;
    }


    /**
     * Run initialization
     */
    run() {
        if (this.isRunning) throw new XwInvalidStateError('Already running');
        if (this.isCompleted) throw new XwInvalidStateError('Already run');

        // The item is now running
        this.isRunning = true;

        // Start
        try {
            const runResult = this.fn();

            if (runResult instanceof Promise) {
                // When the result is a promise, then will defer to wait
                runResult.then((result) => {
                    this.isRunning = false;
                    this.isCompleted = true;
                    this._onRunSuccessful(result);
                }).catch((e) => {
                    this.isRunning = false;
                    this.isCompleted = true;
                    _onInitFailed(e, this.provides);
                });
            } else {
                // Otherwise, handle success immediately
                this.isRunning = false;
                this.isCompleted = true;
                this._onRunSuccessful(runResult);
            }
        } catch (e) {
            // Run failed (although completed)
            this.isRunning = false;
            this.isCompleted = true;
            _onInitFailed(e, this.provides);
        }
    }


    /**
     * Handle running successful
     * @param {*} result
     * @private
     */
    _onRunSuccessful(result) {
        this.result = result;
        for (const provide of this.provides) {
            _onProvided(provide, result);
        }

        // Always loop and check again
        _runInits();
    }
}


/**
 * Run any initializations that can be initialized
 * @private
 */
function _runInits() {
    for (const provide of _providers.keys()) {
        const initObj = _providers.get(provide);

        // Ignore completed/running providers
        if (initObj.isCompleted) continue;
        if (initObj.isRunning) continue;

        // Check dependencies
        if (!initObj.isDependenciesFulfilled()) continue;

        // Run the initialization
        initObj.run();
    }
}


/**
 * Handle that item is provided
 * @param {string} provide Provided item
 * @param {*} result Result associated with the provides
 * @private
 */
function _onProvided(provide, result) {
    _provideds.set(provide, {
        when: Date.now(),
        result: result,
    });
    _pendings.delete(provide);
}


/**
 * If anything provides pending
 * @return {boolean}
 * @private
 */
function _hasPending() {
    return _pendings.size > 0;
}


/**
 * Application setup (initialization and dependency management)
 * @class
 * @hideconstructor
 */
class XwAppSetup {
    /**
     * Add function execution to be run during initialization
     * @param {string|string[]} provides Provided completion when this initialization completes
     * @param {string[]} depends Dependencies of this initialization
     * @param {function()} fn Initialization function
     */
    init(provides, depends, fn) {
        let _provides = xw.requires(provides);
        const _depends = xw.requires(depends);
        const _fn = xw.requires(fn);

        // Cast to array if required
        if (typeof _provides === 'string') _provides = [_provides];

        // Must provide something
        if (_provides.length <= 0) {
            logger.warn('Initialization that provides nothing will have a random provide created');
            const provide = 'anonymous_' + random.hexString(12);
            _provides.push(provide);
        }

        // Link up with providers
        const initObj = new XwAppSetup_Init(_fn, _provides, _depends);
        for (const provide of _provides) {
            // The provided is always pending
            _pendings.set(provide, false);

            // Then setup providers
            if (_providers.has(provide)) throw new Error('Duplicated providers');
            _providers.set(provide, initObj);
        }
    }


    /**
     * Defer to function execution when ready. The setup will run after this is defined, so
     * this function must be the last to call. Will return when the ready.
     * @param {function()} fn
     * @return {Promise<void>}
     */
    async onReady(fn) {
        const _fn = xw.requires(fn);

        // Prevent duplicated definition
        if (_isReadyDefined) throw new Error('onReady already defined');
        _isReadyDefined = true;

        return new Promise((resolve, reject) => {

            // Setup the listener
            xw.onDocumentReady(async () => {

                // Wait until there is nothing pending
                await axw.waitFor(() => {
                    return !_hasPending();
                });

                // Then we can execute
                _fn();

                // Consider resolved
                resolve();
            });

            // Setup the handler for initialization failures
            _onInitFailed = (e, provides) => {
                logger.warn('appSetup.onReady failed during initialization', {
                    provides: provides,
                    e: e,
                });
                reject(e);
            };

            // Start initializations
            _runInits();
        });
    }


    /**
     * Defer to function execution when ready. The setup will run after this is defined, so
     * this function must be the last to call. Ignores the return.
     * @param {function()} fn
     */
    onReadyNoRet(fn) {
        (async () => {
            try {
                await this.onReady(fn);
            } catch (e) {
                logger.error('appSetup.onReady', {
                    e: e,
                });
            }
        })();
    }
}


const appSetup = new XwAppSetup();
export default appSetup;
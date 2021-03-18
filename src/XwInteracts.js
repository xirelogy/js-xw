import axw from "./XwAsync";
import i18n from "./XwI18n";
import xw from "./Xw";
import PrivateProperties from "./internals/_privates";
import XwInteractsState from "./XwInteractsState";
import XwCommonFinalizable from "./XwCommonFinalizable";
import XwUnsupportedError from "./XwUnsupportedError";
import XwInteractsListener from "./XwInteractsListener";

const _l = i18n.init('XwInteracts');


/**
 * Control kind
 * @type {string}
 */
const KIND_CONTROL = 'control';

/**
 * Calculation kind
 * @type {string}
 */
const KIND_CALCULATE = 'calculate';


/**
 * @typedef XwInteracts_Data
 * @property {object} vars Variables bag
 * @property {XwInteracts_ControlDesc[]} descs List of control descriptors
 * @property {object} watches Variables to be watched
 * @property {string} currentEventScene Current event scene
 * @property {*|null} currentEventData Current associated data
 * @property {function(HTMLElement|null,Error|null):void|null} onValidated Handler for validation completed
 * @property {function(HTMLElement|null):(HTMLElement|null)|null} onEnter Handler for enter helper
 * @private
 */

/**
 * @type {XwInteracts_Data}
 * @private
 */
const _init = {
    vars: null,
    descs: [],
    watches: {},
    currentEventScene: '',
    currentEventData: null,
    onValidated: null,
    onEnter: null,
};


const _p = new PrivateProperties(_init);


/**
 * Default validation function
 * @param {*} value Input value
 * @param {XwInteractsState} state Current control state
 * @return {*} Validated value
 */
function defaultValidateImpl(value, state) {
    if (value === null) return null;
    if (value === '') return null;

    return value;
}


/**
 * Default formatting function
 * @param {*} value Underlying value
 * @param {XwInteractsState} state Current control state
 * @return {*} Formatted value
 */
function defaultFormatImpl(value, state) {
    return value;
}


/**
 * Default control listening subscriber
 * @param {HTMLElement} control Target control
 * @param {XwInteractsListener} listener State object
 */
function defaultControlListen(control, listener) {
    control.addEventListener('input', ev => {
        listener.onEvent('input', ev);
    });
    control.addEventListener('focusout', ev => {
        listener.onEvent('focusout', ev);
    });
}


/**
 * Default value getter
 * @param {HTMLElement} control Target control
 * @return {*}
 */
function defaultControlGet(control) {

    if (control === null) return null;

    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
        return control.checked;
    }

    if (control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement) {
        return control.value;
    }

    return null;
}


/**
 * Default value setter
 * @param {HTMLElement} control Target control
 * @param {*} value Value to be set
 */
function defaultControlSet(control, value) {

    if (control === null) return;

    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
        control.checked = value;
        return;
    }

    if (control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement) {
        control.value = value;
    }
}


/**
 * Perform validation
 * @param {XwInteracts_Data} d Private data
 * @param {XwInteracts_ControlDesc|null} desc Target control's descriptor
 * @param {function(any):void} [onValidated=null] Specific validated receiver
 */
function onValidate(d, desc, onValidated) {

    if (desc === null) return;

    const _onValidated = xw.defaultable(onValidated, (payload) => {
        if (d.onValidated !== null) {
            d.onValidated(desc.control, payload);
        }
    });

    let value = null;

    try {
        const state = new XwInteracts_RunState(d.currentEventScene, d.currentEventData);
        value = desc.onValidate(desc.controlGet(desc.control), state);
        _onValidated(null);

        if (value !== null && state.isForceFormat) {
            const formatted = desc.onFormat(value, state);
            if (formatted !== null) {
                desc.controlSet(desc.control, formatted);
            }
        }
    } catch (e) {
        _onValidated(e);
        value = null;
    }

    if (desc.name) {
        watchNotify(d, desc.name, value);
    }
}


/**
 * Handle control's key-up event
 * @param {XwInteracts_Data} d Private data
 * @param {XwInteracts_ControlDesc} desc Target control's descriptor
 * @param {Event} ev Event object
 */
function onCommonKeyUpEvent(d, desc, ev) {
    if (!xw.isDefined(ev.keyCode)) return;
    switch (ev.keyCode) {
        case 13:
            if (d.onEnter !== null) {
                const nextControl = d.onEnter(desc.control);
                if (nextControl !== null) nextControl.focus();
            }
            break;

        default:
            break;
    }
}


/**
 * Handle control's event
 * @param {string} scene Event scene
 * @param {XwInteracts_Data} d Private data
 * @param {XwInteracts_ControlDesc} desc Target control's descriptor
 * @param {Event} ev Event object
 */
function onControlEvent(scene, d, desc, ev) {

    const handle = new XwCommonFinalizable({
        data: {
            lastScene: null,
            lastData: null,
            state: ev,
        },
        onInit: data => {
            data.lastScene = d.currentEventScene;
            data.lastData = d.currentEventData;
            d.currentEventScene = scene;
            d.currentEventData = data.state;
        },
        onFinal: data => {
            d.currentEventScene = data.lastScene;
            d.currentEventData = data.lastData;
        }
    });

    try {
        onValidate(d, desc);
    } finally {
        handle.final();
    }
}


/**
 * Get list of variables to be watched for
 * @param {string|string[]|null} watchSpec Watch specification
 * @return {string[]} Final variables to be watched for
 */
function getWatches(watchSpec) {

    if (watchSpec === null) return [];

    if (typeof watchSpec === 'string') return [watchSpec];

    if (watchSpec instanceof Array) return watchSpec;

    throw new XwUnsupportedError(watchSpec, _l('variable watch specification'));
}


/**
 * Subscribe to a variable watch
 * @param {XwInteracts_Data} d Private data
 * @param {string} watch Current watch variable
 * @param {XwInteracts_ControlDesc} desc Target control's descriptor
 */
function watchSubscribe(d, watch, desc) {
    const receivers = xw.isDefined(d.watches[watch]) ? d.watches[watch] : [];
    receivers.push(desc);
    d.watches[watch] = receivers;
}


/**
 * Get notified that a variable watch has a (possible) value update
 * @param {XwInteracts_Data} d Private data
 * @param {string} watch Watch variable that had been updated
 * @param {*} value Value changed
 */
function watchNotify(d, watch, value) {

    if (!xw.isDefined(d.watches[watch])) return;

    const handle = new XwCommonFinalizable({
        data: {
            lastScene: null,
            lastData: null,
        },
        onInit: data => {
            data.lastScene = d.currentEventScene;
            data.lastData = d.currentEventData;
            d.currentEventScene = 'watch';
            d.currentEventData = null;
        },
        onFinal: data => {
            d.currentEventScene = data.lastScene;
            d.currentEventData = data.lastData;
        }
    });

    try {
        for (const desc of d.watches[watch]) {
            onValidate(d, desc);
        }
    } finally {
        handle.final();
    }
}


class XwInteracts_RunState extends XwInteractsState {

    /**
     * @constructor
     * @property {string} scene Current scene when the function is invoked
     * @property {*|null} [data=null] Associated data
     */
    constructor(scene, data) {
        super();

        this.scene = xw.requires(scene);
        this.data = xw.defaultable(data);

        Object.defineProperty(this, 'isForceFormat', {
            get: function() {
                switch (this.scene) {
                    case 'focusout':
                        return true;
                    case 'watch':
                        return true;
                    case 'recalculate':
                        return true;
                    default:
                        return false;
                }
            }
        });
    }


    /**
     * Default validation function
     * @param {*} value Input value
     * @return {*} Validated value
     */
    defaultValidate(value) {
        return defaultValidateImpl(value, this);
    }


    /**
     * Default formatting function
     * @param {*} value Underlying value
     * @return {*} Formatted value
     */
    defaultFormat(value) {
        return defaultFormatImpl(value, this);
    }
}


class XwInteracts_RunListener extends XwInteractsListener {

    /**
     * @constructor
     * @param {XwInteracts_Data} d Private data
     * @param {XwInteracts_ControlDesc} desc Target control descriptor
     */
    constructor(d, desc) {
        super();
        this._d = d;
        this._desc = desc;
    }


    /**
     * Handover event to the listener
     * @param {string} scene Event scene
     * @param {Event} ev Event argument
     */
    onEvent(scene, ev) {
        onControlEvent(scene, this._d, this._desc, ev);
    }
}


/**
 * Interactions support
 * @class
 * @alias module.Interacts
 */
class XwInteracts {

    /**
     * @constructor
     * @param {object} vars Variables bag
     * @param {object} [options] Specific options
     */
    constructor(vars, options) {

        const _vars = xw.requires(vars);
        const _options = xw.defaultable(options, {});

        /**
         * @type {XwInteracts_Data}
         * @private
         */
        const _d = _p.access(this);
        _d.vars = vars;
    }


    /**
     * Bind a control
     * @param {HTMLElement|null} control
     * @param {string} [name] Variable name for the control, if required
     * @param {object} [options] Binding options
     * @param {function(*,XwInteractsState):*} [options.onValidate] Validation function
     * @param {function(*,XwInteractsState):*} [options.onFormat] Format function
     * @param {XwInteractsCodec} [options.codec] Codec providing validation/format (overrides onValidate/onFormat)
     * @param {function(HTMLElement,XwInteractsListener)} [options.controlListen] Listener subscriber for given control
     * @param {function(HTMLElement):*} [options.controlGet] Get value from given control
     * @param {function(HTMLElement,*)} [options.controlSet] Set value into given control
     * @param {string|string[]} [options.watch] Variable/variable(s) to be watched for triggering recalculation
     */
    bindControl(control, name, options) {

        const _control = xw.defaultable(control);
        const _name = xw.defaultable(name);
        const _options = xw.defaultable(options, {});
        let _onValidate = xw.defaultable(_options.onValidate, defaultValidateImpl);
        let _onFormat = xw.defaultable(_options.onFormat, defaultFormatImpl);
        const _codec = xw.defaultable(_options.codec);
        const _controlListen = xw.defaultable(_options.controlListen, defaultControlListen);
        const _controlGet = xw.defaultable(_options.controlGet, defaultControlGet);
        const _controlSet = xw.defaultable(_options.controlSet, defaultControlSet);
        const _watches = getWatches(xw.defaultable(_options.watch));
        const _kind = xw.defaultable(_options.kind, KIND_CONTROL);  // Hidden options

        if (_codec !== null) {
            _onValidate = (value, state) => {
                return _codec.validate(value, state)
            };
            _onFormat = (value, state) => {
                return _codec.format(value, state);
            };
        }

        if (typeof _onValidate !== 'function') throw new Error(_l('onValidate must be a function'));
        if (typeof _onFormat !== 'function') throw new Error(_l('onFormat must be a function'));
        if (typeof _controlListen !== 'function') throw new Error('controlListen must be a function');
        if (typeof _controlGet !== 'function') throw new Error('controlGet must be a function');
        if (typeof _controlSet !== 'function') throw new Error('controlSet must be a function');

        /**
         * @type {XwInteracts_Data}
         * @private
         */
        const _d = _p.access(this);

        /**
         * @typedef XwInteracts_ControlDesc
         * @property {HTMLElement|null} control Target control, if any
         * @property {string|null} name Variable name of the control, if any
         * @property {string} kind Control kind
         * @property {function(*, XwInteractsState): *} onValidate Validator function
         * @property {function(*, XwInteractsState): *} onFormat Formatter function
         * @property {function(HTMLElement): *} controlGet Getter function
         * @property {function(HTMLElement, *)} controlSet Setter function
         */

        /**
         * @type {XwInteracts_ControlDesc}
         * Control descriptor
         */

        const desc = {
            control: _control,
            name: _name,
            kind: _kind,
            onValidate: _onValidate,
            onFormat: _onFormat,
            controlGet: _controlGet,
            controlSet: _controlSet,
        };

        if (_control !== null) {
            const listener = new XwInteracts_RunListener(_d, desc);
            _controlListen(_control, listener);

            _control.addEventListener('keyup', async (ev) => {
                onCommonKeyUpEvent(_d, desc, ev);
            });
        }

        if (_name !== null) {
            Object.defineProperty(_d.vars, _name, {
                get: function() {
                    const state = new XwInteracts_RunState(_d.currentEventScene, _d.currentEventData);
                    return desc.onValidate(desc.controlGet(_control), state);
                },
                set: function(value) {
                    const state = new XwInteracts_RunState(_d.currentEventScene, _d.currentEventData);
                    const formatted = desc.onFormat(value, state);
                    desc.controlSet(_control, formatted);
                    watchNotify(_d, _name, value);
                }
            });
        }

        _d.descs.push(desc);

        for (const watch of _watches) {
            watchSubscribe(_d, watch, desc);
        }
    }


    /**
     * Bind a calculated control
     * @param {string|null} name Variable name for the control, if any
     * @param {function():*} formula Calculation formula
     * @param {object} [options] Binding options
     * @param {function(*)} [options.onCalculate] Notification that the formula is recalculated
     * @param {string|string[]} [options.watch] Variable/variable(s) to be watched for triggering recalculation
     */
    bindCalculate(name, formula, options) {

        const _name = xw.requires(name);
        const _formula = xw.requires(formula);
        const _options = xw.defaultable(options, {});
        const _onCalculate = xw.defaultable(_options.onCalculate);
        const _watch = xw.defaultable(_options.watch);

        if (_onCalculate !== null && typeof _onCalculate !== 'function') {
            throw new Error(_l('onCalculate must be a function'));
        }

        const outOptions = {};

        outOptions.controlGet = control => {
            return _formula();
        };

        if (_onCalculate !== null) {
            outOptions.controlSet = (control, value) => {
                _onCalculate(value);
                if (_name !== null) watchNotify(_d, _name, value);
            };
        } else {
            outOptions.controlSet = (control, value) => {
                if (_name !== null) watchNotify(_d, _name, value);
            };
        }

        if (_watch !== null) {
            outOptions.watch = _watch;
        }

        outOptions.kind = KIND_CALCULATE;
        this.bindControl(null, _name, outOptions);
    }


    /**
     * Subscribe to notification that validation had completed
     * @param {function(HTMLElement|null,Error|null):void} fn
     */
    onValidated(fn) {
        /**
         * @type {XwInteracts_Data}
         * @private
         */
        const _d = _p.access(this);
        _d.onValidated = fn;
    }


    /**
     * Enable helper to process the 'enter' key as an inteligent tab shortcut
     * @param {function(HTMLElement|null):(HTMLElement|null)} fn Handler to select enter control
     */
    enableEnterHelper(fn) {
        /**
         * @type {XwInteracts_Data}
         * @private
         */
        const _d = _p.access(this);
        _d.onEnter = xw.requires(fn);

        // Also automatically focus
        axw.fork(() => {
            const nextControl = fn(null);
            if (nextControl !== null) nextControl.focus();
        });
    }


    /**
     * Manually trigger all calculation to be re-evaluated
     */
    recalculate() {
        /**
         * @type {XwInteracts_Data}
         * @private
         */
        const _d = _p.access(this);

        const handle = new XwCommonFinalizable({
            data: {
                lastScene: null,
                lastData: null,
            },
            onInit: data => {
                data.lastScene = _d.currentEventScene;
                data.lastData = _d.currentEventData;
                _d.currentEventScene = 'recalculate';
                _d.currentEventData = null;
            },
            onFinal: data => {
                _d.currentEventScene = data.lastScene;
                _d.currentEventData = data.lastData;
            }
        });

        try {
            for (const desc of _d.descs) {
                /* @var {XwInteracts_ControlDesc} desc */
                if (desc.kind != KIND_CALCULATE) continue;
                onValidate(_d, desc);
            }
        } finally {
            handle.final();
        }
    }
}


export default XwInteracts;
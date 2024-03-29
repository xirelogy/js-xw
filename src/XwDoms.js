import xw from "./Xw";
import i18n from "./XwI18n";
import md5 from "blueimp-md5"
import ClipboardJS from "clipboard";

const _l = i18n.init('XwDoms');


/**
 * Create the animate key frame configuration
 * @param {object} propSpecs CSS properties to be animated
 * @return {string} The configuration
 * @private
 */
function _createAnimateKeyFrameConfig(propSpecs) {

    let ret = '';

    for (const prop in propSpecs) {
        const valueSpec = propSpecs[prop];
        const fromValue = valueSpec[0];
        const toValue = valueSpec[1];

        ret += prop + ';[' + fromValue + ']->[' + toValue + ']';
    }

    return ret;
}


/**
 * Run animation using CSS
 * @param {HTMLElement} element Element to be animated
 * @param {object} propSpecs CSS properties to be animated
 * @param {object} [options] Animation options
 * @return {Promise<void>}
 * @private
 */
async function _cssAnimate(element, propSpecs, options) {

    // Get variables
    const _element = xw.requires(element);
    const _propSpecs = xw.requires(propSpecs);
    const _options = xw.defaultable(options, {});

    // Setup the animation keyframe
    const keyframeConfig = _createAnimateKeyFrameConfig(_propSpecs);
    const keyframeName = 'animate-' + md5(keyframeConfig);

    let fromCsses = '';
    let toCsses = '';
    for (const prop in propSpecs) {
        const valueSpec = propSpecs[prop];
        const fromValue = valueSpec[0];
        const toValue = valueSpec[1];

        fromCsses += prop + ':' + fromValue + ';';
        toCsses += prop + ':' + toValue + ';';
    }

    let rule = '@keyframes ' + keyframeName + '{';
    rule += ' from {' + fromCsses + '}';
    rule += ' to {' + toCsses + '}';
    rule += '}';

    xw.insertCustomCss(keyframeName, rule);

    // Ready for animation
    return new Promise((resolve, reject) => {

        // Setup options
        const _optionDelay = xw.defaultable(_options.delay, null);
        if (_optionDelay !== null) {
            _element.style.animationDelay = _optionDelay + 'ms';
        }

        const _optionDirection = xw.defaultable(_options.direction, null);
        if (_optionDirection !== null) {
            _element.style.animationDirection = _optionDirection;
        }

        const _optionDuration = xw.defaultable(_options.duration, null);
        if (_optionDuration !== null) {
            _element.style.animationDuration = _optionDuration + 'ms';
        }

        const _optionEasing = xw.defaultable(_options.easing, null);
        if (_optionEasing !== null) {
            _element.style.animationTimingFunction = _optionEasing;
        }

        const _optionInterations = xw.defaultable(_options.iterations, null);
        if (_optionInterations !== null) {
            _element.style.animationIterationCount = _optionInterations;
        }

        // Cleanup function
        const cleanupFn = () => {
            _element.style.animationDelay = null;
            _element.style.animationDirection = null;
            _element.style.animationDuration = null;
            _element.style.animationTimingFunction = null;
            _element.style.animationIterationCount = null;
            _element.style.animationName = null;
        }

        // Listen to events
        _element.addEventListener('animationcancel', () => {
            cleanupFn();
            reject(new Error(_l('Animation cancelled')));
        }, true);
        _element.addEventListener('animationend', () => {
            cleanupFn();
            for (const prop in _propSpecs) {
                _element.style[prop] = _propSpecs[prop][1];
            }
            resolve();
        });

        // Handle pre-animation
        for (const prop in _propSpecs) {
            _element.style[prop] = _propSpecs[prop][0];
        }

        const _optionBeforeAnimation = xw.defaultable(_options.beforeAnimation, null);
        if (_optionBeforeAnimation !== null) _optionBeforeAnimation();

        // Start animation
        _element.style.animationName = keyframeName;
    })
}


/**
 * DOM related utilities
 * @class
 * @alias module.Doms
 */
class XwDoms {
    /**
     * Show the target element
     * @param {HTMLElement} element Element to be shown
     * @param {string} [displayType] Display type to be shown, default to 'block'
     */
    show(element, displayType) {
        element.style.display = xw.defaultable(displayType, 'block');
    }


    /**
     * Hide the target element
     * @param {HTMLElement} element Element to be shown
     */
    hide(element) {
        element.style.display = 'none';
    }


    /**
     * If target element is shown
     * @param {HTMLElement} element Target element
     * @return {boolean}
     */
    isShown(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }


    /**
     * Run animation
     * @param {HTMLElement} element Element to be animated
     * @param {object} propSpecs CSS properties to be animated
     * @param {object} [options] Animation options
     * @return {Promise<void>}
     */
    async animate(element, propSpecs, options) {
        // Fallback to CSS animation solutions if element.animate() not found
        if (typeof element.animate !== 'function') {
            return _cssAnimate(element, propSpecs, options);
        }

        // Get variables
        const _element = xw.requires(element);
        const _propSpecs = xw.requires(propSpecs);
        const _options = xw.defaultable(options, {});

        return new Promise((resolve, reject) => {
            // Initialize states and keyframes
            const fromState = {};
            const toState = {};

            for (const prop in _propSpecs) {
                const valueSpec = _propSpecs[prop];
                const fromValue = valueSpec[0];
                const toValue = valueSpec[1];

                fromState[prop] = fromValue;
                toState[prop] = toValue;
            }

            const keyframes = [
                fromState,
                toState,
            ];

            // Setup options
            const outOptions = {};

            const translateOptions = (inKey, outKey) => {
                const _inKey = xw.requires(inKey);
                const _outKey = xw.defaultable(outKey, _inKey);

                const _value = xw.defaultable(_options[_inKey], null);
                if (_value === null) return;

                outOptions[_outKey] = _value;
            };

            translateOptions('delay');
            translateOptions('direction');
            translateOptions('duration');
            translateOptions('easing');
            translateOptions('iterations');

            // Start animation
            const anim = _element.animate(keyframes, outOptions);

            anim.oncancel = (ev) => {
                reject(new Error(_l('Animation cancelled')));
            };
            anim.onfinish = (ev) => {
                for (const prop in toState) {
                    _element.style[prop] = toState[prop];
                }
                resolve();
            };

            // Handle pre-animation
            for (const prop in fromState) {
                _element.style[prop] = fromState[prop];
            }

            const _optionBeforeAnimation = xw.defaultable(_options.beforeAnimation, null);
            if (_optionBeforeAnimation !== null) _optionBeforeAnimation();

            // Run the animation
            anim.play();
        });
    }


    /**
     * Bind an element's click action to cause clipboard interaction
     * @param {HTMLElement} element Element to be binded
     * @param {object} [options] Clipboard options
     * @param {HTMLElement} [options.target] Target element to be copied from
     * @param {string} [options.text] Text to be copied
     * @param {function(Event):void} [options.onClipboard] Handler for clipboard action
     */
    clickToClipboard(element, options) {

        const _element = xw.requires(element);
        const _options = xw.defaultable(options, {});
        const _optionsOnClipboard = xw.defaultable(_options.onClipboard);

        const _data = {};

        // Text provider
        if (xw.isDefined(_options.text)) {
            _data.text = (trigger) => {
                return _options.text;
            }
        }

        // Target provider
        if (xw.isDefined(_options.target)) {
            _data.target = (trigger) => {
                return _options.target;
            }
        }

        // Create object
        const cb = new ClipboardJS(_element, _data);

        // Bind event handlers
        const _onClipboard = (isSuccess, ev) => {
            if (_optionsOnClipboard === null) return;

            const newEv = new CustomEvent('clipboard');
            newEv.isSuccess = isSuccess;
            newEv.srcEv = ev;
            _optionsOnClipboard(newEv);
        };

        cb.on('success', (ev) => {
            _onClipboard(true, ev);
        });

        cb.on('error', (ev) => {
            _onClipboard(false, ev);
        });
    }
}


const doms = new XwDoms();
export default doms;
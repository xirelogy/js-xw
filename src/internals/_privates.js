/**
 * @class PrivateProperties
 * Private properties helper
 *
 * @template T
 * @property {T} _init Initialization of the private properties
 * @property {Object<string, WeakMap<object, *>>} _bag Main storage bag
 * @property {WeakMap<object, T>} _cache Cached mappers
 * @private
 */
export default class PrivateProperties {

    /**
     * @constructor
     * @param {T} init Initialization of the private properties
     */
    constructor(init) {
        // Initialize
        this._init = init;
        this._bag = {};
        this._cache = new WeakMap();

        // Loop through the initial object and define all properties
        for (const key in init) {
            if (!init.hasOwnProperty(key)) continue;
            this._bag[key] = new WeakMap();
        }
    }


    /**
     * @methodOf PrivateProperties
     * Bind to the given parent on given property
     * @param {object} parent
     * @param {string} prop
     */
    bind(parent, prop) {
        // Aliasing
        const _this = this;

        // Then define the property
        Object.defineProperty(parent, '_d', {
            get() { return _this.access(parent); }
        });
    }


    /**
     * @methodOf PrivateProperties
     * Access the properties for given parent
     * @param {object} parent
     * @return {T} Property bag
     */
    access(parent) {
        if (this._cache.has(parent)) return this._cache.get(parent);

        const accessor = {};

        for (const key in this._bag) {
            const defaultValue = this._init[key];

            /**
             * @type WeakMap<object, *>
             */
            const bagMap = this._bag[key];

            Object.defineProperty(accessor, key, {
                enumerable: true,
                get() {
                    if (!bagMap.has(parent)) {
                        const value = JSON.parse(JSON.stringify(defaultValue));
                        bagMap.set(parent, value);
                    }
                    return bagMap.get(parent);
                },
                set(value) {
                    bagMap.set(parent, value);
                },
            });
        }

        this._cache.set(parent, accessor);
        return accessor;
    }


    /**
     * @methodOf PrivateProperties
     * Destroy items for given parent
     * @param {object} parent
     */
    destroy(parent) {
        this._cache.delete(parent);
    }
}

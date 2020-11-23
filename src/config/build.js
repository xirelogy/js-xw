const CONF_BUILD_IS_DEVELOPMENT = false;
const CONF_BUILD_DEFAULT_LOCALE = 'en-US';


/**
 * @class _ConfBuild
 * Build configuration
 * @private
 */
class _ConfBuild {
    /**
     * @methodOf _ConfBuild
     * If the current build is for development
     * @return {boolean}
     */
    isDevelopment() {
        return CONF_BUILD_IS_DEVELOPMENT;
    }


    /**
     * @methodOf _ConfBuild
     * The default locale built
     * @return {string}
     */
    getDefaultLocale() {
        return CONF_BUILD_DEFAULT_LOCALE;
    }
}


const _configBuild = new _ConfBuild();
export default _configBuild;

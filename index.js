import appSetup from "./src/XwAppSetup";
import axw from "./src/XwAsync";
import bookmarkPersist from "./src/XwBookmarkPersist";
import bookmarkStore from "./src/XwBookmarkStore";
import doms from "./src/XwDoms";
import i18n from "./src/XwI18n";
import i18nSetup from "./src/XwI18nSetup";
import logger from "./src/XwLogger";
import random from "./src/XwRandom";
import strings from "./src/XwStrings";
import urlBase64 from "./src/XwUrlBase64";
import xhr from "./src/XwXhr";
import xw from "./src/Xw";
import XwCommonFinalizable from "./src/XwCommonFinalizable";
import XwEventListenerHandle from "./src/XwEventListenerHandle";
import XwEventListeners from "./src/XwEventListeners";
import XwFinalizable from "./src/XwFinalizable";
import XwInvalidDataError from "./src/XwInvalidDataError";
import XwInvalidStateError from "./src/XwInvalidStateError";
import XwLoggerSink from "./src/XwLoggerSink";
import XwMergedFinalizable from "./src/XwMergedFinalizable";
import XwPersistable from "./src/XwPersistable";
import XwPrefixedPersistable from "./src/XwPrefixedPersistable";
import XwReleasable from "./src/XwReleasable";
import XwTimeoutError from "./src/XwTimeoutError";
import XwUnsupportedError from "./src/XwUnsupportedError";
import XwXhrAbortedError from "./src/XwXhrAbortedError";
import XwXhrError from "./src/XwXhrError";
import XwXhrHttpError from "./src/XwXhrHttpError";
import XwXhrJsonParseResponse from "./src/XwXhrJsonParseResponse";
import XwXhrJsonPostContent from "./src/XwXhrJsonPostContent";
import XwXhrNetworkError from "./src/XwXhrNetworkError";
import XwXhrParseError from "./src/XwXhrParseError";
import XwXhrParseResponse from "./src/XwXhrParseResponse";
import XwXhrPostContent from "./src/XwXhrPostContent";
import XwXhrRequest from "./src/XwXhrRequest";
import XwXhrTimeoutError from "./src/XwXhrTimeoutError";

import _dummyGenLocales from "./gen/locales";


/**
 * Module definition
 * @namespace module
 */
const mod = {
    /**
     * The static main interface
     * @type Xw
     */
    $: xw,
    CommonFinalizable: XwCommonFinalizable,
    EventListenerHandle: XwEventListenerHandle,
    EventListeners: XwEventListeners,
    Finalizable: XwFinalizable,
    InvalidDataError: XwInvalidDataError,
    InvalidStateError: XwInvalidStateError,
    LoggerSink: XwLoggerSink,
    MergedFinalizable: XwMergedFinalizable,
    Persistable: XwPersistable,
    PrefixedPersistable: XwPrefixedPersistable,
    Releasable: XwReleasable,
    TimeoutError: XwTimeoutError,
    UnsupportedError: XwUnsupportedError,
    /**
     * Application setup support
     * @type XwAppSetup
     */
    appSetup: appSetup,
    /**
     * Asynchronous utilities
     * @type XwAsync
     */
    axw: axw,
    /**
     * Bookmark base persistence
     * @type XwBookmarkPersist
     */
    bookmarkPersist: bookmarkPersist,
    /**
     * Bookmark store
     * @type XwBookmarkStore
     */
    bookmarkStore: bookmarkStore,
    /**
     * Internationalization support
     * @type XwI18n
     */
    i18n: i18n,
    /**
     * Internationalization setup support
     * @type XwI18nSetup
     */
    i18nSetup: i18nSetup,
    /**
     * Logger shim
     * @type XwLogger
     */
    logger: logger,
    /**
     * Random utilities
     * @type XwRandom
     */
    random: random,
    /**
     * String utilities
     * @type XwStrings
     */
    strings: strings,
    /**
     * URL-safe base64 support
     * @type XwUrlBase64
     */
    urlBase64: urlBase64,
    /**
     * HTML DOM elements related utilities
     * @type XwDoms
     */
    doms: doms,
    /**
     * XHR related functionalities
     * @namespace module.Xhr
     */
    Xhr: {
        /**
         * The static XHR interface
         * @type XwXhr
         */
        $: xhr,
        AbortedError: XwXhrAbortedError,
        Error: XwXhrError,
        HttpError: XwXhrHttpError,
        JsonParseResponse: XwXhrJsonParseResponse,
        JsonPostContent: XwXhrJsonPostContent,
        NetworkError: XwXhrNetworkError,
        ParseError: XwXhrParseError,
        ParseResponse: XwXhrParseResponse,
        PostContent: XwXhrPostContent,
        Request: XwXhrRequest,
        TimeoutError: XwXhrTimeoutError,
    },
};

export default mod;

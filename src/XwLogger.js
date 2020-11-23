import XwLoggerSink from "./XwLoggerSink";


/**
 * The logger sink
 * @type {XwLoggerSink}
 * @private
 */
let _sink = new XwLoggerSink();


/**
 * Logger shim
 * @class
 * @hideconstructor
 */
class XwLogger {
    /**
     * Sink of console.log()
     * @param {...*} messages
     */
    log(...messages) {
        _sink.log(...messages);
    }


    /**
     * Sink of console.info()
     * @param {...*} messages
     */
    info(...messages) {
        _sink.info(...messages);
    }


    /**
     * Sink of console.warn()
     * @param {...*} messages
     */
    warn(...messages) {
        _sink.warn(...messages);
    }


    /**
     * Sink of console.error()
     * @param {...*} messages
     */
    error(...messages) {
        _sink.error(...messages);
    }


    /**
     * Sink of console.debug()
     * @param {...*} messages
     */
    debug(...messages) {
        _sink.debug(...messages);
    }
}


const logger = new XwLogger();
export default logger;
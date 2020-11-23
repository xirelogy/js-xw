/**
 * Sink and handle log messages
 * @class
 * @alias module.LoggerSink
 */
class XwLoggerSink {

    /**
     * Sink of console.log()
     * @param {...*} messages
     */
    log(...messages) {
        console.log(...messages);
    }


    /**
     * Sink of console.info()
     * @param {...*} messages
     */
    info(...messages) {
        console.info(...messages);
    }


    /**
     * Sink of console.warn()
     * @param {...*} messages
     */
    warn(...messages) {
        console.warn(...messages);
    }


    /**
     * Sink of console.error()
     * @param {...*} messages
     */
    error(...messages) {
        console.error(...messages);
    }


    /**
     * Sink of console.debug()
     * @param {...*} messages
     */
    debug(...messages) {
        console.debug(...messages);
    }
}


export default XwLoggerSink;
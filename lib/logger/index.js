/**
 * @module lib/logger
 */
'use strict';

var
    config = require('../config');

const
    _levels      = Symbol('_levels'),
    _log         = Symbol('_log');

class Logger {
    /**
     * @class Logger
     * @constructor
     */
    constructor() {
        Object.getOwnPropertyNames(this[_levels]).forEach(key => this[key] = this[_log].bind(this, this[_levels][key]));
    }

    /**
     * Log to console
     *
     * @method      _log
     * @private
     *
     * @param       {Object}  levelConfig   Configuration for the log level
     */
    [_log](levelConfig) {
        var
            args        = Array.prototype.slice.call(arguments, 0),
            levelConfig = args.shift();

        if (!config.debugEnable) {
            return;
        }

        // @TODO: colorize console
        console.log.apply(console, args);
    }
}

/**
 * Level configs
 *
 * @private
 * @property    _levels
 * @type        {Object}
 */
Logger.prototype[_levels] = {
    log:   {},
    info:  {
        color: 'cyan'
    },
    error: {
        color: 'red'
    }
};

module.exports = new Logger();

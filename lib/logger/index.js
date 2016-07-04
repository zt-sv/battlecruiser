/**
 * @module lib/logger
 */
'use strict';

var
    config = require('../config');

const
    DEBUG_ENABLE = config.debugEnable,
    _levels      = Symbol('_levels'),
    _log         = Symbol('_log');

class Logger {
    /**
     * @class Logger
     * @constructor
     */
    constructor() {
        for (let key in this[_levels]) {
            if (this[_levels].hasOwnProperty(key)) {
                this[key] = this[_log].bind(this, this[_levels][key]);
            }
        }
    }

    /**
     * Log to console
     *
     * @method      _log
     * @private
     *
     * @param       {Object}  levelConfig
     */
    [_log](levelConfig, ...options) {
        if (!DEBUG_ENABLE) {
            return;
        }

        // @TODO: сделать цветной вывод в зависимости от конфига
        console.log(...options);
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

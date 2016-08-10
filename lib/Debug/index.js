/**
 * @module      lib/Debug
 *
 * @require     lib/BaseClasses/BaseClass
 * @require     lib/logger
 */
'use strict';

var
    BaseClass = require('../BaseClasses/BaseClass'),
    logger    = require('../logger');

const
    _debugInfo    = Symbol('_debugInfo'),
    _timingsCache = Symbol('_timingsCache');

module.exports = class Debug extends BaseClass {
    /**
     * @class       Debug
     * @constructor
     * @extends     BaseClass
     */
    constructor(req, res) {
        super();

        /**
         * Link to request object
         *
         * @property    req
         * @type        {Object}
         */
        this.req = req;

        /**
         * Link to response object
         *
         * @property    res
         * @type        {Object}
         */
        this.res = res;

        /**
         * Cache storage for time measuring
         *
         * @private
         * @property    _debugInfo
         * @type        {Object}
         */
        this[_timingsCache] = {};

        /**
         * Debug info private storage
         *
         * @private
         * @property    _debugInfo
         * @type        {Object}
         */
        this[_debugInfo] = {
            timings: []
        };
    }

    /**
     * Current time in milliseconds
     *
     * @property  nowMs
     * @type      {Number}
     */
    get nowMs() {
        var
            t = process.hrtime();

        return (t[0] * 1e9 + t[1]) / 1000000;
    }

    /**
     * Print debug information to console
     */
    printDebug() {
    }

    /**
     * Add debug information about external request
     */
    addRequestInfo() {
    }

    /**
     * Start measuring time
     */
    addStartTime(id) {
        if (this[_timingsCache].hasOwnProperty(id)) {
            logger.error(`Time measuring with id ${id} started already`);

            return;
        }

        this[_timingsCache][id] = {
            name: id,
            start: this.nowMs
        };
    }

    /**
     * End measuring time
     */
    addEndTime(id) {
        if (!this[_timingsCache].hasOwnProperty(id)) {
            logger.error(`Time measuring with id ${id} not started yet`);

            return;
        }

        this[_timingsCache][id].end = this.nowMs;

        this[_debugInfo].timings.push(this[_timingsCache][id]);
    }

    /**
     * Add debug information to HTML
     */
    addInfoToHtml() {
    }

    /**
     * Add debug information to JSON
     */
    addInfoToJson() {
    }
};

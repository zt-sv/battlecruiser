/**
 * @module      lib/PropChecker/Checker
 *
 * @requires    lib/PropChecker/helpers
 */
'use strict';

var
    h = require('./helpers');

class Checker {
    /**
     * @class       Checker
     * @constructor
     */
    constructor(checkFunction) {
        if (h.isNull(checkFunction) || h.isUndefined(checkFunction) || !h.isFunction(checkFunction)) {
            throw Error('Class Checker accept only function as argument');
        }

        this.check = checkFunction;
    }

    /**
     * Check property
     * @param   {string}  prop    Property key
     * @param   {*}       value   Property value
     *
     * @throws  {Error}     Throw error when value is invalid
     */
    check(prop, value) {}
}

module.exports = Checker;

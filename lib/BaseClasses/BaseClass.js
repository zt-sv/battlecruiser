/**
 * @module      lib/BaseClasses/BaseClass
 *
 * @requires    lib/PropChecker
 */
'use strict';

var
    PropChecker = require('../PropChecker');

module.exports = class BaseClass {
    /**
     * @class       BaseClass
     * @constructor
     *
     * @param       {Object}    options     Object for validation
     */
    constructor(options) {
        this.constructor.optionsValidation = this.constructor.optionsValidation || {};
        PropChecker.validate(options, this.constructor.optionsValidation);
    }
};

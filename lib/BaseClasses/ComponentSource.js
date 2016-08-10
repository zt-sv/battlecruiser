/**
 * @module      lib/BaseClasses/ComponentSource
 *
 * @require     lib/BaseClasses/Model
 * @require     lib/PropChecker
 */
'use strict';

var
    Model       = require('./Model'),
    PropChecker = require('../PropChecker');

const
    attrs = Symbol();

class ComponentSource extends Model {

    /**
     * @class       ComponentSource
     * @constructor
     * @extends     BaseClass
     *
     * @param       {Object} options
     */
    constructor(options) {
        super(options);

        /**
         * Private store for the attributes
         *
         * @property    attrs
         * @type        {Object}
         * @private
         */
        this[attrs] = {};

        this.setProperties(options);
    }

    /**
     * Source name
     *
     * @property    name
     * @type        {string}
     */
    get name() {
        return this[attrs].name || this[attrs].source.constructor.name;
    }

    /**
     * @param   {string}  value
     */
    set name(value) {
        this[attrs].name = value;
    }

    /**
     * Source class
     *
     * @property    source
     * @type        {string}
     */
    get source() {
        return this[attrs].source || this[attrs].component.constructor.name;
    }

    /**
     * @param   {string}  value
     */
    set source(value) {
        this[attrs].source = value;
    }

    /**
     * Source options
     *
     * @property    options
     * @type        {Object}
     */
    get options() {
        return this[attrs].options;
    }

    /**
     * @param   {Object}  value
     */
    set options(value) {
        this[attrs].options = value;
    }
}

/**
 * Validation config
 *
 * @static
 * @property    optionsValidation
 * @type        {Object}
 */
ComponentSource.optionsValidation = {
    name:    PropChecker.isString,
    source:  [PropChecker.isRequired, PropChecker.isFunction],
    options: PropChecker.isObject
};

module.exports = ComponentSource;

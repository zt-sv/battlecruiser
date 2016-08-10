/**
 * @module      lib/BaseClasses/ComponentDependency
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

class ComponentDependency extends Model {

    /**
     * @class       ComponentDependency
     * @constructor
     * @extends     Model
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
     * Component alias. If not set, return property `component`
     *
     * @property    alias
     * @type        {string}
     */
    get alias() {
        return this[attrs].alias || this[attrs].component.constructor.name;
    }

    /**
     * @param   {string}  value
     */
    set alias(value) {
        this[attrs].alias = value;
    }

    /**
     * Component options
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

    /**
     * Component name
     *
     * @property    component
     * @type        {string}
     */
    get component() {
        return this[attrs].component;
    }

    /**
     * @param   {string}  value
     */
    set component(value) {
        this[attrs].component = value;
    }

    /**
     * Component instance
     *
     * @property    instance
     * @type        {Component}
     */
    get instance() {
        return this[attrs].instance;
    }

    /**
     * @param   {Component}  value
     */
    set instance(value) {
        this[attrs].instance = value;
    }

    /**
     * Placeholder name
     *
     * @property    relatesToYield
     * @type        {string}
     */
    get relatesToYield() {
        return this[attrs].relatesToYield;
    }

    /**
     * @param   {string}  value
     */
    set relatesToYield(value) {
        this[attrs].relatesToYield = value;
    }
}

/**
 * Validation config
 *
 * @static
 * @property    optionsValidation
 * @type        {Object}
 */
ComponentDependency.optionsValidation = {
    alias:          PropChecker.isString,
    component:      [PropChecker.isRequired, PropChecker.isFunction],
    options:        PropChecker.isObject,
    instance:       PropChecker.isObject,
    relatesToYield: PropChecker.isString
};

module.exports = ComponentDependency;

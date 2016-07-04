/**
 * @module      lib/BaseClasses/ComponentDependency
 *
 * @require     lib/BaseClasses/BaseClass
 */
'use strict';

var
    BaseClass = require('./BaseClass');

const
    _alias          = Symbol('_alias'),
    _component      = Symbol('_component'),
    _instance       = Symbol('_instance'),
    _relatesToYield = Symbol('_relatesToYield');

class ComponentDependency extends BaseClass {
    /**
     * @class       ComponentDependency
     * @constructor
     * @extends     BaseClass
     *
     * @param       {Object} options
     */
    constructor(options) {
        super(options);
    }

    /**
     * Component alias. If not set, return property `component`
     *
     * @property    alias
     * @type        {string}
     */
    get alias() {
        return this[_alias] || this[_component];
    }

    /**
     * @param   {string}  value
     */
    set alias(value) {
        this[_alias] = value;
    }

    /**
     * Component name
     *
     * @property    component
     * @type        {string}
     */
    get component() {
        return this[_component];
    }

    /**
     * @param   {string}  value
     */
    set component(value) {
        this[_component] = value;
    }

    /**
     * Component instance
     *
     * @property    instance
     * @type        {Component}
     */
    get instance() {
        return this[_instance];
    }

    /**
     * @param   {Component}  value
     */
    set instance(value) {
        this[_instance] = value;
    }

    /**
     * Placeholder name
     *
     * @property    relatesToYield
     * @type        {string}
     */
    get relatesToYield() {
        return this[_relatesToYield];
    }

    /**
     * @param   {string}  value
     */
    set relatesToYield(value) {
        this[_relatesToYield] = value;
    }
}

ComponentDependency.prototype[_alias] = null;
ComponentDependency.prototype[_component] = null;
ComponentDependency.prototype[_instance] = null;
ComponentDependency.prototype[_relatesToYield] = null;

module.exports = ComponentDependency;

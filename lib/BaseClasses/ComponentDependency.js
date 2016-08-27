/**
 * @module      lib/BaseClasses/ComponentDependency
 *
 * @require     lib/BaseClasses/Model
 */
'use strict';

var
    Model = require('./Model');

module.exports = Model.create('ComponentDependency', {

    /**
     * Alias
     *
     * @property    alias
     * @type        {string}
     */
    alias:          Model.isString,

    /**
     * @property    component
     * @type        {Component}
     */
    component:      [Model.isRequired, Model.isFunction],

    /**
     * @property    options
     * @type        {Object}
     */
    options:        Model.isObject,

    /**
     * Component instance
     *
     * @property    instance
     * @type        {Object}
     */
    instance:       Model.isObject,

    /**
     * @property    relatesToYield
     * @type        {string}
     */
    relatesToYield: Model.isString
});

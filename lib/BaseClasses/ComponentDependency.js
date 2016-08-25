/**
 * @module      lib/BaseClasses/ComponentDependency
 *
 * @require     lib/BaseClasses/Model
 */
'use strict';

var
    Model = require('./Model');

module.exports = new Model({
    alias:          Model.isString,
    component:      [Model.isRequired, Model.isFunction],
    options:        Model.isObject,
    instance:       Model.isObject,
    relatesToYield: Model.isString
});

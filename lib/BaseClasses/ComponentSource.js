/**
 * @module      lib/BaseClasses/ComponentSource
 *
 * @require     lib/BaseClasses/Model
 * @require     lib/PropChecker
 */
'use strict';

var
    Model = require('./Model');

module.exports = Model.create('ComponentSource', {
    name:    Model.isString,
    source:  [Model.isRequired, Model.isFunction],
    options: Model.isObject
});

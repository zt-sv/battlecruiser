/**
 * @module      lib/BaseClasses/Model
 *
 * @require     lib/PropChecker
 * @require     lib/logger
 */
'use strict';

var
    PropChecker    = require('../PropChecker'),
    h              = require('../PropChecker/helpers'),
    map            = new WeakMap(),

    propCheckers   = Object.getOwnPropertyNames(PropChecker),

    /**
     * Generate guid string
     *
     * @return {string}
     */
    guid = function() {
        var
            s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    /**
     * Internal properties provider
     *
     * @param   {Object}  object
     * @return  {Object}            Internal storage for the object
     */
    internal       = function(object) {
        if (!map.has(object)) {
            map.set(object, {});
        }

        return map.get(object);
    },

    /**
     * Define property for object
     *
     * @param   {string}                    propName        Property name
     * @param   {PropChecker|PropChecker[]} validator       Validator or array of validators
     * @param   {*}                         defaultValue    Default value for object
     */
    defineProperty = function(propName, validator, defaultValue) {
        var
            uuid = guid(),
            getter = () => internal(this)[uuid] || defaultValue,
            setter = newValue => {
                if (h.isArray(validator)) {
                    validator.forEach(checker => {
                        if (checker instanceof PropChecker) {
                            checker.check(propName, newValue);
                        }
                    });
                } else {
                    validator.check(propName, newValue);
                }

                internal(this)[uuid] = newValue;
            };

        getter.__UUID = uuid;

        Object.defineProperty(this, propName, {
            get:          getter,
            set:          setter,
            enumerable:   true,
            configurable: false
        });
    },

    /**
     * Setup attributes for object
     *
     * @param {Object}  obj             Object
     * @param {Object}  attrs           Attributes with validation config for object
     * @param {Object}  defaultValues   Default values for object
     *
     * @throw {Error}                   throw Error when property doesn't have a validation type
     */
    defineObjectProperties = function(obj, attrs, defaultValues) {
        Object.getOwnPropertyNames(attrs).forEach(key => {
            var
                defaultValue = defaultValues ? defaultValues[key] : null;

            if (attrs[key] instanceof PropChecker || h.isArray(attrs[key])) {
                return defineProperty.call(obj, key, attrs[key], defaultValue);
            }

            if (h.isObject(attrs[key])) {
                let
                    internalObj = {},
                    getter      = () => internalObj,
                    setter      = newValue => {
                        if (h.isNull(newValue) || h.isUndefined(newValue) || !h.isObject(newValue)) {
                            throw Error(`Property "${key}" must be Object, but got ${newValue}`);
                        }

                        // Fill attributes
                        Object.getOwnPropertyNames(newValue).forEach(key => internalObj[key] = newValue[key]);
                    };

                getter.__UUID = guid();
                defineObjectProperties(internalObj, attrs[key], defaultValue);

                return Object.defineProperty(obj, key, {
                    get:          getter,
                    set:          setter,
                    enumerable:   true,
                    configurable: false
                });
            }

            throw Error(`Property ${key} should have a type`);
        });

        // Prevent new properties
        Object.freeze(obj);
    };

class Model {
    /**
     * Model base class
     *
     * @class Model
     * @constructor
     */
    constructor(values) {
        var
            attrs         = this.constructor.attrs || {},
            defaultValues = this.constructor.defaultValues || {};

        // Create model attributes with validation
        defineObjectProperties(this, attrs, defaultValues);

        // Fill attributes
        Object.getOwnPropertyNames(values || {}).forEach(key => this[key] = values[key]);

        // Validate default values
        PropChecker.validate(this, attrs);
    }
}

propCheckers.forEach(checker => {
    if (PropChecker[checker] instanceof PropChecker) {
        Model[checker] = PropChecker[checker];
    }
});

/**
 * Create new model
 *
 * @deprecated
 */
Model.create = (modelName, attrs, defaultValues) => {
    var
        generatedModel = class extends Model {
            constructor(values) {
                super(values);
            }
        };

    generatedModel.attrs = attrs;
    generatedModel.defaultValues = defaultValues;

    Object.defineProperty(generatedModel, 'name', {
        get: () => modelName,
        configurable: false
    });

    return generatedModel;
};

module.exports = Model;

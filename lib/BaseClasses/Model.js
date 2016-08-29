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

    guid = function() {
        var
            s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    internal       = function(object) {
        if (!map.has(object)) {
            map.set(object, {});
        }

        return map.get(object);
    },

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
        Object.getOwnPropertyNames(attrs).forEach(key => {
            var
                defaultValue = defaultValues ? defaultValues[key] : null;

            if (attrs[key] instanceof PropChecker || h.isArray(attrs[key])) {
                defineProperty.call(this, key, attrs[key], defaultValue);
            } else if (h.isObject(attrs[key])) {
                // PropChecker.validate(obj[key], propsTypes[key]);
            } else {
                throw Error(`Property ${key} should have a type`);
            }
        });

        // Fill attributes
        Object.getOwnPropertyNames(values || {}).forEach(key => this[key] = values[key]);

        // Validate
        PropChecker.validate(this, attrs);

        // Prevent new properties
        Object.freeze(this);
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

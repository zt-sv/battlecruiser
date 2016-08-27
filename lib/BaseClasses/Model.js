/**
 * @module      lib/BaseClasses/Model
 *
 * @require     lib/PropChecker
 * @require     lib/logger
 */
'use strict';

var
    PropChecker = require('../PropChecker'),
    h           = require('../PropChecker/helpers'),
    map         = new WeakMap(),

    internal    = function(object) {
        if (!map.has(object)) {
            map.set(object, {});
        }

        return map.get(object);
    },

    defineProperty = function(propName, validator, defaultValue) {
        var
            id = ++internal(this).counter;

        Object.defineProperty(this, propName, {
            get: () => internal(this)[id] || defaultValue,
            set: newValue => {
                if (h.isArray(validator)) {
                    validator.forEach(checker => {
                        if (checker instanceof PropChecker) {
                            checker.check(propName, newValue);
                        }
                    });
                } else {
                    validator.check(propName, newValue);
                }

                internal(this)[id] = newValue;
            },
            enumerable: true,
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
    constructor(propsTypes, defaultValues) {
        internal(this).counter = 0;

        for (let key in propsTypes) {
            if (!propsTypes.hasOwnProperty(key)) {
                continue;
            }

            let defaultValue = defaultValues ? defaultValues[key] : null;

            if (propsTypes[key] instanceof PropChecker || h.isArray(propsTypes[key])) {
                defineProperty.call(this, key, propsTypes[key], defaultValue);
            } else if (h.isObject(propsTypes[key])) {
                // PropChecker.validate(obj[key], propsTypes[key]);
            } else {
                throw Error(`Property ${key} should have a type`);
            }
        }
    }
}

// Get static methods from PropChecker
for (let checker in PropChecker) {
    if (!PropChecker.hasOwnProperty(checker)) {
        continue;
    }

    if (PropChecker[checker] instanceof PropChecker) {
        Model[checker] = PropChecker[checker];
    }
}

/**
 * Create new model
 */
Model.create = (modelName, propsTypes, defaultValues) => {
    var
        generatedModel = class extends Model {
            constructor(values) {
                super(propsTypes, defaultValues);

                for (let key in values) {
                    if (!values.hasOwnProperty(key)) {
                        continue;
                    }

                    this[key] = values[key];
                }

                PropChecker.validate(this, propsTypes);
            }
        };

    Object.defineProperty(generatedModel, 'name', {
        get: () => modelName,
        configurable: false
    });

    return generatedModel;
};

module.exports = Model;

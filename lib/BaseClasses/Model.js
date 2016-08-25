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
    constructor(options, defaultValues) {
        internal(this).counter = 0;

        for (let key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }

            let defaultValue = defaultValues ? defaultValues[key] : null;

            if (options[key] instanceof PropChecker || h.isArray(options[key])) {
                defineProperty.call(this, key, options[key], defaultValue);
            } else if (h.isObject(options[key])) {
                // PropChecker.validate(obj[key], options[key]);
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
 * Model deep freezing
 *
 * @method  deepFreeze
 * @static
 *
 * @param   {Object}    o Model to freeze
 */
Model.deepFreeze = o => {
    // freeze object itself
    Object.freeze(o);

    // freeze all object props
    for (let propKey in o) {
        let
            prop = o[propKey];

        if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
            continue;
        }

        // Recursive call `deepFreeze` for objects
        Model.deepFreeze(prop);
    }
};

module.exports = Model;

/**
 * @module      lib/PropChecker
 *
 * @requires    lib/PropChecker/helpers
 */
'use strict';

var
    h = require('./helpers');

const
    except = ['isNull', 'isUndefined', 'notNullNotUndef'];

class PropChecker {
    /**
     * @class       PropChecker
     * @constructor
     *
     * @param   {Function}  checkFunction   Validation function
     */
    constructor(checkFunction) {
        if (h.isNull(checkFunction) || h.isUndefined(checkFunction) || !h.isFunction(checkFunction)) {
            throw Error('Class PropChecker accept only function as argument');
        }

        /**
         * Check property
         * @param   {string}    prop    Property key
         * @param   {*}         value   Property value
         *
         * @throws  {Error}     Throw error when value is invalid
         */
        this.check = checkFunction;
    }
}

// isRequired
PropChecker.isRequired = new PropChecker((prop, value) => {
    if (h.isNull(value) || h.isUndefined(value)) {
        throw Error(`Property "${prop}" is required. Actual result: ${value}`);
    }
});

// Autogenerate simple validators
for (let method in h) {
    if (!h.hasOwnProperty(method) || ~except.indexOf(method)) {
        continue;
    }

    let
        type = method.replace('is', '').toLocaleLowerCase();

    PropChecker[method] = new PropChecker((prop, value) => {
        if (!(h.isNull(value) || h.isUndefined(value)) && !h[method](value)) {
            throw Error(`Property "${prop}" must be ${type}, but got ${value}`);
        }
    });
}

PropChecker.isArrayOf = typeChecker => {
    if (h.isNull(typeChecker) || h.isUndefined(typeChecker) || !(typeChecker instanceof PropChecker)) {
        throw Error(`Type checker for array elements must be instance of PropChecker, but got ${typeChecker}`);
    }

    return new PropChecker((prop, value) => {
        PropChecker.isArray.check(prop, value);

        value.forEach(el => {
            if (h.isNull(el) || h.isUndefined(el)) {
                throw Error(`Property "${prop}" have wrong element in array`);
            }

            try {
                typeChecker.check(prop, el);
            } catch (err) {
                throw Error(`Property "${prop}" have wrong element in array`);
            }
        });
    });
};

PropChecker.isEqual = equalValue => {
    if (h.isNull(equalValue) || h.isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return new PropChecker((prop, value) => {
        if (value !== equalValue) {
            throw Error(`Property "${prop}" must be equal to ${equalValue}`);
        }
    });
};

/**
 * @todo: develop isDeepEqual checker with tests
 *
 * @param   {*} equalValue
 * @returns {PropChecker}
 */
PropChecker.isDeepEqual = equalValue => {
    if (h.isNull(equalValue) || h.isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return new PropChecker((prop, value) => {

    });
};

/**
 * @todo: develop isInstanceOf checker with tests
 */

/**
 * Object validator
 *
 * @param   {Object}    obj     Object
 * @param   {Object}    config  Validation config
 *
 * @throw   {Error}     throw   Error when object is invalid or property doesn't have a validation type
 */
PropChecker.validate = function(obj, config) {
    Object.getOwnPropertyNames(config || {}).forEach(key => {
        if (config[key] instanceof PropChecker) {
            return config[key].check(key, obj[key]);
        }

        if (h.isArray(config[key])) {
            return config[key].forEach(checker => {
                if (checker instanceof PropChecker) {
                    checker.check(key, obj[key]);
                } else {
                    throw Error(`Property ${key} should have a type`);
                }
            });
        }

        if (h.isObject(config[key])) {
            return PropChecker.validate(obj[key], config[key]);
        }

        throw Error(`Property ${key} should have a type`);
    });
};

module.exports = PropChecker;

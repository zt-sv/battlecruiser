/**
 * @module lib/BaseClasses/Validator
 */
'use strict';

var
    toString              = Object.prototype.toString,
    isNull                = value => value === null && typeof value === 'object',
    isUndefined           = value => typeof value === 'undefined',
    isNotRequiredWithType = (prop, type) => {
        return toString.call(prop) === type || isNull(prop) || isUndefined(prop);
    };

class Validator {
    /**
     * @class       Validator
     * @constructor
     */
    constructor() {
    }

    validateField(field, fieldValidationConfig) {

    }

    validate(obj, config) {
        for (let key in config) {
            if (config.hasOwnProperty(key)) {
                this.validateField(obj[key], config.key);
            }
        }
    }
}

Validator.isRequired = function(propName, propValue) {
    if (isNull(propValue) || isUndefined(propValue)) {
        throw Error(`Property "${propName}" is required`);
    }
};

Validator.isString = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object String]')) {
        throw Error(`Property "${propName}" must be string, but got ${propValue}`);
    }
};

Validator.isNumber = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Number]')) {
        throw Error(`Property "${propName}" must be number, but got ${propValue}`);
    }
};

Validator.isBoolean = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Boolean]')) {
        throw Error(`Property "${propName}" must be boolean, but got ${propValue}`);
    }
};

Validator.isArray = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Array]')) {
        throw Error(`Property "${propName}" must be array, but got ${propValue}`);
    }
};

Validator.isObject = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Object]')) {
        throw Error(`Property "${propName}" must be object, but got ${propValue}`);
    }
};

Validator.isDate = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Date]')) {
        throw Error(`Property "${propName}" must be date, but got ${propValue}`);
    }
};

Validator.isFunction = function(propName, propValue) {
    if (!isNotRequiredWithType(propValue, '[object Function]')) {
        throw Error(`Property "${propName}" must be function, but got ${propValue}`);
    }
};

Validator.isArrayOf = function(typeChecker) {
    var
        validFn = toString.call(typeChecker) === '[object Function]';

    if (isNull(typeChecker) || isUndefined(typeChecker) || !validFn) {
        throw Error(`Type checker for array elements must be function, but got ${typeChecker}`);
    }

    return function(propName, propValue) {

    };
};

Validator.isEqual = function(equalValue) {
    if (isNull(equalValue) || isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return function(propName, propValue) {

    };
};

Validator.isDeepEqual = function(equalValue) {
    if (isNull(equalValue) || isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return function(propName, propValue) {

    };
};

module.exports = Validator;

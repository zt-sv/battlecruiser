/**
 * @module lib/BaseClasses/Validator
 */
'use strict';

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
    var
        isNull      = propValue === null && typeof propValue === 'object',
        isUndefined = typeof propValue === 'undefined';

    if (isNull || isUndefined) {
        throw Error(`Property "${propName}" is required`);
    }
};

Validator.isString = function(propName, propValue) {
    if (typeof propValue !== 'string') {
        throw Error(`Property "${propName}" must be string`);
    }
};

Validator.isNumber = function(propName, propValue) {
    if (isNaN(propValue) || typeof propValue !== 'number') {
        throw Error(`Property "${propName}" must be number`);
    }
};

Validator.isBoolean = function(propName, propValue) {
    if (typeof propValue !== 'boolean') {
        throw Error(`Property "${propName}" must be boolean`);
    }
};

Validator.isArray = function(propName, propValue) {
    if (Object.prototype.toString.call(propValue) !== '[object Array]') {
        throw Error(`Property "${propName}" must be array`);
    }
};

Validator.isArrayOf = function(typeChecker) {
    return function(propName, propValue) {

    };
};

Validator.isEqual = function(equalValue) {
    return function(propName, propValue) {

    };
};

Validator.isDeepEqual = function(equalValue) {
    return function(propName, propValue) {

    };
};

Validator.isObject = function(propName, propValue) {

};

module.exports = Validator;

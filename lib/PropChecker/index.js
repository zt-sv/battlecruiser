///**
// * @module lib/PropChecker
// */
//'use strict';
//
//var
//    toString              = Object.prototype.toString,
//    isNull                = value => value === null && typeof value === 'object',
//    isUndefined           = value => typeof value === 'undefined',
//
//    types = ['String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'Function'],
//    checkers = {
//        isRequired: function(value) {
//            return isNull(value) || isUndefined(value);
//        }
//    };
//
//class Validator {
//    /**
//     * @class       Validator
//     * @constructor
//     */
//    constructor() {
//    }
//
//    validateField(field, fieldValidationConfig) {
//
//    }
//
//    validate(obj, config) {
//        for (let key in config) {
//            if (config.hasOwnProperty(key)) {
//                this.validateField(obj[key], config.key);
//            }
//        }
//    }
//}
//
//
//
//
//
//Validator.isRequired = function(prop, value) {
//    if (checkers.isRequired(value)) {
//        throw Error(`Property "${prop}" is required`);
//    }
//};
//
//Validator.isString = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isString(value)) {
//        throw Error(`Property "${prop}" must be string, but got ${value}`);
//    }
//};
//
//Validator.isNumber = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isNumber(value)) {
//        throw Error(`Property "${prop}" must be number, but got ${value}`);
//    }
//};
//
//Validator.isBoolean = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isBoolean(value)) {
//        throw Error(`Property "${prop}" must be boolean, but got ${value}`);
//    }
//};
//
//Validator.isArray = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isArray(value)) {
//        throw Error(`Property "${prop}" must be array, but got ${value}`);
//    }
//};
//
//Validator.isObject = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isObject(value)) {
//        throw Error(`Property "${prop}" must be object, but got ${value}`);
//    }
//};
//
//Validator.isDate = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isDate(value)) {
//        throw Error(`Property "${prop}" must be date, but got ${value}`);
//    }
//};
//
//Validator.isFunction = function(prop, value) {
//    if (!checkers.isRequired(value) && !checkers.isFunction(value)) {
//        throw Error(`Property "${prop}" must be function, but got ${value}`);
//    }
//};
//
//Validator.isArrayOf = function(typeChecker) {
//    if (isNull(typeChecker) || isUndefined(typeChecker) || !(typeChecker instanceof Validator)) {
//        throw Error(`Type checker for array elements must be type checker function, but got ${typeChecker}`);
//    }
//
//    return function(prop, value) {
//        Validator.isArray(prop, value);
//
//        value.forEach(el => {
//            if (isNull(el) || isUndefined(el)) {
//                throw Error(`Property "${prop}" have wrong element in array`);
//            }
//
//            try {
//                typeChecker(prop, el);
//            } catch (err) {
//                throw Error(`Property "${prop}" have wrong element in array`);
//            }
//        });
//    };
//};
//
//Validator.isEqual = function(equalValue) {
//    if (isNull(equalValue) || isUndefined(equalValue)) {
//        throw Error('You should pass an any value');
//    }
//
//    return function(prop, value) {
//
//    };
//};
//
//Validator.isDeepEqual = function(equalValue) {
//    if (isNull(equalValue) || isUndefined(equalValue)) {
//        throw Error('You should pass an any value');
//    }
//
//    return function(prop, value) {
//
//    };
//};
//
//module.exports = Validator;

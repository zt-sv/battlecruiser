/**
 * @module      lib/BaseClasses/Model
 *
 * @require     lib/PropChecker
 * @require     lib/logger
 */
'use strict';

var
    PropChecker = require('../PropChecker'),
    logger      = require('../logger');

module.exports = class Model {
    /**
     * Model base class
     *
     * @class Model
     * @constructor
     */
    constructor() {
        let
            properties = Object.getOwnPropertyNames(this.__proto__);

        for (let i = properties.length - 1; i >= 0; i--) {
            let
                key = properties[i];

            if (this.__lookupGetter__(key)) {
                let
                    prop = Object.getOwnPropertyDescriptor(this.__proto__, key);

                prop.enumerable = true;

                Object.defineProperty(this, key, prop);
            }
        }
    }

    /**
     * Set model properties
     *
     * @method  setProperties
     *
     * @param   {Object}  properties
     */
    setProperties(properties) {
        this.constructor.optionsValidation = this.constructor.optionsValidation || {};
        PropChecker.validate(properties, this.constructor.optionsValidation);

        for (let key in properties) {
            if (properties.hasOwnProperty(key) && this.__lookupSetter__(key)) {
                this[key] = properties[key];
            } else {
                logger.warn(`Unknown property ${key} in model ${this.constructor.name}`);
            }
        }
    }

    /**
     * Model deep freezing
     *
     * @method  deepFreeze
     *
     * @param   {Object}    obj Object to freeze
     */
    deepFreeze(obj) {
        let
            o = obj || this;

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
            this.deepFreeze(prop);
        }
    }
};

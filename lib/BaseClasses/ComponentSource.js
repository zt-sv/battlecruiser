/**
 * @module      lib/BaseClasses/ComponentSource
 *
 * @require     lib/BaseClasses/BaseClass
 */
'use strict';

var
    BaseClass = require('./BaseClass');

const
    _name    = Symbol('_name'),
    _options = Symbol('_options');

class ComponentSource extends BaseClass {
    /**
     * @class       ComponentSource
     * @constructor
     * @extends     BaseClass
     *
     * @param       {Object} options
     */
    constructor(options) {
        super(options);
    }

    /**
     * Source name
     *
     * @property    name
     * @type        {string}
     */
    get name() {
        return this[_name];
    }

    /**
     * @param   {string}  value
     */
    set name(value) {
        this[_name] = value;
    }

    /**
     * Source options
     *
     * @property    options
     * @type        {Object}
     */
    get options() {
        return this[_options];
    }

    /**
     * @param   {Object}  value
     */
    set options(value) {
        this[_options] = value;
    }
}

ComponentSource.prototype[_name] = null;
ComponentSource.prototype[_options] = null;

module.exports = ComponentSource;

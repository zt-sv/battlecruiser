/**
 * @module lib/PropChecker/helpers
 */
'use strict';

var
    toString    = Object.prototype.toString,

    types       = ['String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'Function', 'RegExp', 'Error'],
    isNull      = value => value === null && typeof value === 'object',
    isUndefined = value => typeof value === 'undefined',
    helpers     = {
        isNull:          isNull,
        isUndefined:     isUndefined,
        notNullNotUndef: value => !isNull(value) && !isUndefined(value)
    };

// Create basic type checkers
types.forEach(type => {
    helpers['is' + type] = value => toString.call(value) === `[object ${type}]`;
});

module.exports = helpers;

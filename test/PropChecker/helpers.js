'use strict';

var
    helpers       = require('../../lib/PropChecker/helpers'),

    staticMethods = {
        'isNull':          {
            validValues:   [null],
            invalidValues: [undefined].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isUndefined':     {
            validValues:   [undefined],
            invalidValues: [null].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'notNullNotUndef': {
            validValues:   [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns),
            invalidValues: [].concat(nullAndUndef)
        },
        'isString':        {
            validValues:   [].concat(strings),
            invalidValues: [].concat(nullAndUndef, numbers, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isNumber':        {
            validValues:   [].concat(numbers),
            invalidValues: [].concat(nullAndUndef, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isBoolean':       {
            validValues:   [].concat(bool),
            invalidValues: [].concat(nullAndUndef, numbers, strings, objects, arrays, dates, errors, regexps, fns)
        },
        'isArray':         {
            validValues:   [].concat(arrays),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, dates, errors, regexps, fns)
        },
        'isObject':        {
            validValues:   [].concat(objects),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, arrays, dates, errors, regexps, fns)
        },
        'isDate':          {
            validValues:   [].concat(dates),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, errors, regexps, fns)
        },
        'isFunction':      {
            validValues:   [].concat(fns),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, regexps)
        },
        'isRegExp':        {
            validValues:   [].concat(regexps),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, fns)
        },
        'isError':         {
            validValues:   [].concat(errors),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, regexps, fns)
        }
    };

describe('Testing "lib/PropChecker/helpers"...', function() {
    describe('public methods', function() {
        it(`should to have public methods: ${Object.keys(staticMethods).map(method => `
        - ` + method)}
        `, function() {
            for (let method in staticMethods) {
                expect(helpers).to.have.ownProperty(method);
            }
        });
    });

    for (let method in staticMethods) {
        if (!staticMethods.hasOwnProperty(method)) {
            continue;
        }

        let
            validValues   = staticMethods[method].validValues,
            invalidValues = staticMethods[method].invalidValues;

        describe(`static method "${method}"`, function() {
            it(`${method} should return true with values`, function() {
                validValues.forEach(value => {
                    expect(helpers[method](value)).to.be.true;
                });
            });

            it(`${method} should return false with values`, function() {
                invalidValues.forEach(value => {
                    expect(helpers[method](value)).to.be.false;
                });
            });

        });
    }
});

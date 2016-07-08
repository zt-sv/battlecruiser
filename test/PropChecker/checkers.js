'use strict';

var
    PropChecker   = require('../../lib/PropChecker'),
    propName      = 'testingProp',
    staticMethods = {
        'isRequired':  {
            validValues:   [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns),
            invalidValues: [].concat(nullAndUndef),
            errMessage:    `Property "${propName}" is required`
        },
        'isString':    {
            validValues:   [].concat(nullAndUndef, strings),
            invalidValues: [].concat(numbers, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isNumber':    {
            validValues:   [].concat(nullAndUndef, numbers),
            invalidValues: [].concat(strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isBoolean':   {
            validValues:   [].concat(nullAndUndef, bool),
            invalidValues: [].concat(numbers, strings, objects, arrays, dates, errors, regexps, fns)
        },
        'isArray':     {
            validValues:   [].concat(nullAndUndef, arrays),
            invalidValues: [].concat(numbers, strings, bool, objects, dates, errors, regexps, fns)
        },
        'isObject':    {
            validValues:   [].concat(nullAndUndef, objects),
            invalidValues: [].concat(numbers, strings, bool, arrays, dates, errors, regexps, fns)
        },
        'isDate':      {
            validValues:   [].concat(nullAndUndef, dates),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, errors, regexps, fns)
        },
        'isFunction':  {
            validValues:   [].concat(nullAndUndef, fns),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps)
        },
        'isRegExp':    {
            validValues:   [].concat(nullAndUndef, regexps),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, errors, fns)
        },
        'isError':     {
            validValues:   [].concat(nullAndUndef, errors),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, regexps, fns)
        },
        'isArrayOf':   {
            validValues:   [],
            invalidValues: []
        },
        'isEqual':     {
            validValues:   [],
            invalidValues: []
        },
        'isDeepEqual': {
            validValues:   [],
            invalidValues: []
        }
    };

describe('Testing checkers in "lib/PropChecker"...', function() {
    describe('checkers', function() {
        it(`should to have public checkers: ${Object.keys(staticMethods).map(method => `
        - ` + method)}
        `, function() {
            for (let method in staticMethods) {
                if (staticMethods.hasOwnProperty(method)) {
                    expect(PropChecker).to.have.ownProperty(method);
                }
            }
        });
    });

    for (let method in staticMethods) {
        if (!staticMethods.hasOwnProperty(method)) {
            continue;
        }

        let
            validValues   = staticMethods[method].validValues,
            invalidValues = staticMethods[method].invalidValues,
            errMessage    = staticMethods[method].errMessage || `Property "${propName}" must be`;

        if (!validValues.length && !invalidValues.length) {
            continue;
        }

        describe(`checker "${method}"`, function() {
            it(`${method} should work with values`, function() {
                validValues.forEach(value => {
                    expect(() => PropChecker[method].check(propName, value)).to.not.throw();
                });
            });

            it(`${method} should throw error with values`, function() {
                invalidValues.forEach(value => {
                    expect(() => PropChecker[method].check(propName, value))
                        .to.throw(Error, errMessage);
                });
            });

        });
    }

    describe('checker "isArrayOf"', function() {
        it('isArrayOf should work with instance of PropChecker only', function() {
            var
                except      = ['isArrayOf', 'isEqual', 'isDeepEqual'],
                validValues = [];

            for (let method in staticMethods) {
                if (!staticMethods.hasOwnProperty(method) || ~except.indexOf(method)) {
                    continue;
                }

                validValues.push(PropChecker[method]);
            }

            validValues.forEach(value => {
                expect(() => PropChecker.isArrayOf(value)).to.not.throw();
            });
        });

        it('isArrayOf should throw error with any values', function() {
            var
                invalid = [].concat(nullAndUndef, strings, numbers, bool, objects, arrays, dates, errors, regexps, fns);

            invalid.forEach(value => {
                expect(() => PropChecker.isArrayOf(value))
                    .to.throw(Error, 'Type checker for array elements must be instance of PropChecker');
            });
        });

        it('isArrayOf should throw error if try validate not array except null and undefined', function() {
            var
                invalid         = [].concat(numbers, strings, bool, objects, dates, fns),
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber);

            invalid.forEach(value => {
                expect(() => isArrayOfNumber.check(propName, value))
                    .to.throw(Error, `Property "${propName}" must be array`);
            });
        });

        it('isArrayOf should no throw error if array elements have compatible type', function() {
            var
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber),
                isArrayOfArray  = PropChecker.isArrayOf(PropChecker.isArray),
                isArrayOfObject = PropChecker.isArrayOf(PropChecker.isObject),
                isArrayOfString = PropChecker.isArrayOf(PropChecker.isString);

            numbers.forEach(value => {
                expect(() => isArrayOfNumber.check(propName, [value])).to.not.throw();
            });

            strings.forEach(value => {
                expect(() => isArrayOfString.check(propName, [value])).to.not.throw();
            });

            objects.forEach(value => {
                expect(() => isArrayOfObject.check(propName, [value])).to.not.throw();
            });

            arrays.forEach(value => {
                expect(() => isArrayOfArray.check(propName, [value])).to.not.throw();
            });
        });

        it('isArrayOf should throw error if array elements have not compatible type', function() {
            var
                invalidValues   = [].concat(nullAndUndef, strings, bool, objects, arrays, dates, fns),
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber);

            invalidValues.forEach(value => {
                expect(() => isArrayOfNumber.check(propName, [value]))
                    .to.throw(Error, `Property "${propName}" have wrong element in array`);
            });
        });
    });

    describe('checker "isEqual"', function() {
        it('isEqual should work with any values except null and undefined', function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => PropChecker.isEqual(value)).to.not.throw();
            });
        });

        it('isEqual should throw error with null and undefined', function() {
            var
                invalidValues = [].concat(nullAndUndef);

            invalidValues.forEach(value => {
                expect(() => PropChecker.isEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });

    describe('checker "isDeepEqual"', function() {
        it('isDeepEqual should work with any values except null and undefined', function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => PropChecker.isDeepEqual(value)).to.not.throw();
            });
        });

        it('isDeepEqual should throw error with null and undefined', function() {
            var
                invalidValues = [].concat(nullAndUndef);

            invalidValues.forEach(value => {
                expect(() => PropChecker.isDeepEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });
});

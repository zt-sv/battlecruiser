'use strict';

var
    checkers      = require('../../lib/PropChecker/checkers'),
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

describe('Testing "lib/PropChecker/checkers"...', function() {
    describe('public methods', function() {
        it(`should to have public methods: ${Object.keys(staticMethods).map(method => `
        - ` + method)}
        `, function() {
            for (let method in staticMethods) {
                if (staticMethods.hasOwnProperty(method)) {
                    expect(checkers).to.have.ownProperty(method);
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

        describe(`static method "${method}"`, function() {
            it(`${method} should work with values`, function() {
                validValues.forEach(value => {
                    expect(() => checkers[method].check(propName, value)).to.not.throw();
                });
            });

            it(`${method} should throw error with values`, function() {
                invalidValues.forEach(value => {
                    expect(() => checkers[method].check(propName, value))
                        .to.throw(Error, errMessage);
                });
            });

        });
    }

    describe('static method "isArrayOf"', function() {
        it('isArrayOf should work with validator type checkers only', function() {
            var
                except      = ['isArrayOf', 'isEqual', 'isDeepEqual'],
                validValues = [];

            for (let method in staticMethods) {
                if (!staticMethods.hasOwnProperty(method) || ~except.indexOf(method)) {
                    continue;
                }

                validValues.push(checkers[method]);
            }

            validValues.forEach(value => {
                expect(() => checkers.isArrayOf(value)).to.not.throw();
            });
        });

        it('isArrayOf should throw error with any values', function() {
            var
                invalid = [].concat(nullAndUndef, strings, numbers, bool, objects, arrays, dates, errors, regexps, fns);

            invalid.forEach(value => {
                expect(() => checkers.isArrayOf(value))
                    .to.throw(Error, 'Type checker for array elements must be type checker function');
            });
        });

        it('isArrayOf should throw error if try validate not array except null and undefined', function() {
            var
                invalid         = [].concat(numbers, strings, bool, objects, dates, fns),
                isArrayOfNumber = checkers.isArrayOf(checkers.isNumber);

            invalid.forEach(value => {
                expect(() => isArrayOfNumber.check(propName, value))
                    .to.throw(Error, `Property "${propName}" must be array`);
            });
        });

        it('isArrayOf should no throw error if array elements have compatible type', function() {
            var
                isArrayOfNumber = checkers.isArrayOf(checkers.isNumber),
                isArrayOfArray  = checkers.isArrayOf(checkers.isArray),
                isArrayOfObject = checkers.isArrayOf(checkers.isObject),
                isArrayOfString = checkers.isArrayOf(checkers.isString);

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
                isArrayOfNumber = checkers.isArrayOf(checkers.isNumber);

            invalidValues.forEach(value => {
                expect(() => isArrayOfNumber.check(propName, [value]))
                    .to.throw(Error, `Property "${propName}" have wrong element in array`);
            });
        });
    });

    describe('static method "isEqual"', function() {
        it('isEqual should work with any values except null and undefined', function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => checkers.isEqual(value)).to.not.throw();
            });
        });

        it('isEqual should throw error with null and undefined', function() {
            var
                invalidValues = [].concat(nullAndUndef);

            invalidValues.forEach(value => {
                expect(() => checkers.isEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });

    describe('static method "isDeepEqual"', function() {
        it('isDeepEqual should work with any values except null and undefined', function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => checkers.isDeepEqual(value)).to.not.throw();
            });
        });

        it('isDeepEqual should throw error with null and undefined', function() {
            var
                invalidValues = [].concat(nullAndUndef);

            invalidValues.forEach(value => {
                expect(() => checkers.isDeepEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });
});

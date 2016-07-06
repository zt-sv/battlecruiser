'use strict';

var
    chai          = require('chai'),
    Validator     = require('../../lib/BaseClasses/Validator'),
    expect        = chai.expect,
    should        = chai.should(),

    methods       = [
        'validate'
    ],

    undef         = [null, undefined],
    numbers       = [1, 1.23, 0, NaN, new Number(), new Number(0), new Number(10)],
    strings       = ['', '1', new String(), new String(''), new String('asd')],
    bool          = [true, false, new Boolean(), new Boolean(true)],
    objects       = [{}, {foo: 'foo'}, new Object(), new Object({})],
    arrays        = [[], [0], ['asd'], new Array(), new Array(10)],
    dates         = [new Date()],
    fns           = [function() {}, class SomeClass {}],

    staticMethods = {
        'isRequired': {
            validValues:   [].concat(numbers, strings, bool, objects, arrays, dates, fns),
            invalidValues: [].concat(undef),
            errMessage:    'Property "testKey" is required'
        },
        'isString':   {
            validValues:   [].concat(undef, strings),
            invalidValues: [].concat(numbers, bool, objects, arrays, dates, fns),
            errMessage:    'Property "testKey" must be string'
        },
        'isNumber':   {
            validValues:   [].concat(undef, numbers),
            invalidValues: [].concat(strings, bool, objects, arrays, dates, fns),
            errMessage:    'Property "testKey" must be number'
        },
        'isBoolean':  {
            validValues:   [].concat(undef, bool),
            invalidValues: [].concat(numbers, strings, objects, arrays, dates, fns),
            errMessage:    'Property "testKey" must be boolean'
        },
        'isArray':    {
            validValues:   [].concat(undef, arrays),
            invalidValues: [].concat(numbers, strings, bool, objects, dates, fns),
            errMessage:    'Property "testKey" must be array'
        },
        'isObject':   {
            validValues:   [].concat(undef, objects),
            invalidValues: [].concat(numbers, strings, bool, arrays, dates, fns),
            errMessage:    'Property "testKey" must be object'
        },
        'isDate':     {
            validValues:   [].concat(undef, dates),
            invalidValues: [].concat(numbers, strings, bool, arrays, objects, fns),
            errMessage:    'Property "testKey" must be date'
        },
        'isFunction': {
            validValues:   [].concat(undef, fns),
            invalidValues: [].concat(numbers, strings, bool, arrays, objects, dates),
            errMessage:    'Property "testKey" must be function'
        },
        'isArrayOf':  {
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

describe('Testing "Validator"...', function() {
    describe('public methods', function() {
        it(`should to have static properties: ${methods.map(method => `
        - ` + method)}
        `, function() {
            methods.forEach(method => {
                expect(Validator).to.respondTo(method);
            });
        });
    });

    describe('public static methods', function() {
        it(`should to have static methods: ${Object.keys(staticMethods).map(method => `
        - ` + method)}
        `, function() {
            for ( let method in staticMethods ) {
                expect(Validator).itself.to.respondTo(method);
            }
        });
    });

    for ( let method in staticMethods ) {
        if ( !staticMethods.hasOwnProperty(method) ) {
            continue;
        }

        let
            validValues   = staticMethods[method].validValues,
            invalidValues = staticMethods[method].invalidValues;

        if (!validValues.length && !invalidValues.length) {
            continue;
        }

        describe(`static method "${method}"`, function() {
            var
                errMessage    = staticMethods[method].errMessage;

            it(`${method} should work with values`, function() {
                validValues.forEach(value => {
                    expect(() => Validator[method]('testKey', value)).to.not.throw();
                });
            });

            it(`${method} should throw error with values`, function() {
                invalidValues.forEach(value => {
                    expect(() => Validator[method]('testKey', value)).to.throw(Error, errMessage);
                });
            });

        });
    }

    describe(`static method "isArrayOf"`, function() {
        it(`isArrayOf should work with functions only`, function() {
            var
                validValues = [].concat(fns);

            validValues.forEach(value => {
                expect(() => Validator.isArrayOf(value)).to.not.throw();
            });
        });

        it(`isArrayOf should throw error with any values except functions`, function() {
            var
                invalidValues = [].concat(undef, numbers, strings, bool, objects, arrays, dates);

            invalidValues.forEach(value => {
                expect(() => Validator.isArrayOf(value)).to.throw(Error, 'Type checker for array elements must be function');
            });
        });
    });

    describe(`static method "isEqual"`, function() {
        it(`isEqual should work with any values except null and undefined`, function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => Validator.isEqual(value)).to.not.throw();
            });
        });

        it(`isEqual should throw error with null and undefined`, function() {
            var
                invalidValues = [].concat(undef);

            invalidValues.forEach(value => {
                expect(() => Validator.isEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });

    describe(`static method "isDeepEqual"`, function() {
        it(`isDeepEqual should work with any values except null and undefined`, function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(value => {
                expect(() => Validator.isDeepEqual(value)).to.not.throw();
            });
        });

        it(`isDeepEqual should throw error with null and undefined`, function() {
            var
                invalidValues = [].concat(undef);

            invalidValues.forEach(value => {
                expect(() => Validator.isDeepEqual(value)).to.throw(Error, 'You should pass an any value');
            });
        });
    });

    //describe('method "validate"', function() {
    //    it('should validate plate object', function() {
    //        var
    //            obj = {
    //                foo: 'bar',
    //                types: ['first', 'second'],
    //                age: 30,
    //                prop: {}
    //            },
    //
    //            validationConfig = {
    //
    //            };
    //
    //        expect(Validator).to.have.property(prop);
    //    });
    //});
});

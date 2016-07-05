'use strict';

var
    chai        = require('chai'),
    Validator   = require('../../lib/BaseClasses/Validator'),
    expect      = chai.expect,
    should      = chai.should(),

    methods     = [
        'validate'
    ],

    staticMethods = [
        'isRequired',
        'isString',
        'isNumber',
        'isBoolean',
        'isArray',
        'isArrayOf',
        'isObject',
        'isEqual',
        'isDeepEqual'
    ];

describe('Testing "Validator"...', function() {
    describe('public methods', function() {
        it(`should to have static properties: ${methods.map(method => `
        - ` + method)}
        `, function() {
            var
                validator = new Validator();

            methods.forEach(method => {
                expect(validator).to.have.property(method);
                expect(validator[method]).to.be.a('function');
            });
        });
    });

    describe('public static methods', function() {
        it(`should to have static methods: ${staticMethods.map(prop => `
        - ` + prop)}
        `, function() {
            staticMethods.forEach(prop => {
                expect(Validator).to.have.property(prop);
                expect(Validator[prop]).to.be.a('function');
            });
        });
    });

    describe('static method "isRequired"', function() {
        it('should not throw error for all normal values except null and undefined', function() {
            var
                values = [
                    '',
                    '1',
                    1,
                    1.23,
                    true,
                    false,
                    0,
                    NaN,
                    {},
                    {
                        foo: 'foo'
                    },
                    [],
                    [0],
                    ['asd'],
                    new String(),
                    new Number(),
                    new Array(),
                    new Object(),
                    new Boolean(),
                    new Date()
                ],
                testValue = value => Validator.isRequired('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.be.ok;
            });
        });

        it('should throw error for null and undefined', function() {
            var
                values = [
                    null,
                    undefined
                ],
                testValue = value => Validator.isRequired('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.throw('Property "testKey" is required');
            });
        });
    });

    describe('static method "isString"', function() {
        it('should not throw error for strings, null and undefined', function() {
            var
                values = [
                    null,
                    undefined,
                    '',
                    '1',
                    new String()
                ],
                testValue = value => Validator.isString('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.be.ok;
            });
        });

        it('should throw error for all values except strings', function() {
            var
                values = [
                    1,
                    1.23,
                    true,
                    false,
                    0,
                    NaN,
                    {},
                    {
                        foo: 'foo'
                    },
                    [],
                    [0],
                    ['asd'],
                    new Number(),
                    new Array(),
                    new Object(),
                    new Boolean(),
                    new Date()
                ],
                testValue = value => Validator.isString('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.throw('Property "testKey" must be string');
            });
        });
    });

    describe('static method "isNumber"', function() {
        it('should not throw error for numbers, null and undefined', function() {
            var
                values = [
                    null,
                    undefined,
                    0,
                    1,
                    1.34,
                    new Number()
                ],
                testValue = value => Validator.isNumber('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.be.ok;
            });
        });

        it('should throw error for all values except numbers', function() {
            var
                values = [
                    '',
                    '1',
                    true,
                    false,
                    NaN,
                    {},
                    {
                        foo: 'foo'
                    },
                    [],
                    [0],
                    ['asd'],
                    new Array(),
                    new Object(),
                    new Boolean(),
                    new String(),
                    new Date()
                ],
                testValue = value => Validator.isNumber('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.throw('Property "testKey" must be number');
            });
        });
    });

    describe('static method "isBoolean"', function() {
        it('should not throw error for booleans, null and undefined', function() {
            var
                values = [
                    null,
                    undefined,
                    true,
                    false,
                    new Boolean()
                ],
                testValue = value => Validator.isBoolean('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.be.ok;
            });
        });

        it('should throw error for all values except booleans', function() {
            var
                values = [
                    '',
                    '1',
                    1,
                    0,
                    NaN,
                    {},
                    {
                        foo: 'foo'
                    },
                    [],
                    [0],
                    ['asd'],
                    new Array(),
                    new Object(),
                    new Number(),
                    new String(),
                    new Date()
                ],
                testValue = value => Validator.isBoolean('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.throw('Property "testKey" must be boolean');
            });
        });
    });

    describe('static method "isArray"', function() {
        it('should not throw error for array, null and undefined', function() {
            var
                values = [
                    null,
                    undefined,
                    [],
                    [0],
                    ['asd'],
                    new Array(),
                    new Array(10)
                ],
                testValue = value => Validator.isArray('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.be.ok;
            });
        });

        it('should throw error for all values except array', function() {
            var
                values = [
                    '',
                    '1',
                    1,
                    0,
                    NaN,
                    {},
                    {
                        foo: 'foo'
                    },
                    true,
                    false,
                    new Boolean(),
                    new Object(),
                    new Number(),
                    new String(),
                    new Date()
                ],
                testValue = value => Validator.isArray('testKey', value);

            values.forEach(value => {
                expect(testValue.bind(null, value)).to.throw('Property "testKey" must be array');
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

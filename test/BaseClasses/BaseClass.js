'use strict';

var
    PropChecker = require('../../lib/PropChecker'),
    BaseClass   = require('../../lib/BaseClasses/BaseClass');

describe('Testing "lib/BaseClasses/Battlecruiser"...', function() {
    describe('validate options', function() {
        it('should not throw error when options correct', function() {
            var
                TestClass = class TestClass extends BaseClass {
                },
                testCases = [
                    {},
                    {
                        foo: 'bar'
                    },
                    {
                        age: 31
                    }
                ];

            TestClass.optionsValidation = {
                foo: PropChecker.isString,
                age: PropChecker.isNumber
            };

            testCases.forEach(testCase => {
                expect(() => new TestClass(testCase)).to.not.throw();
            });
        });

        it('should throw error when options incorrect', function() {
            var
                TestClass = class TestClass extends BaseClass {
                },
                testCases = [
                    {},
                    {
                        foo: 28
                    },
                    {
                        foo: 'bar',
                        age: 'bar'
                    }
                ];

            TestClass.optionsValidation = {
                foo: [PropChecker.isRequired, PropChecker.isString],
                age: PropChecker.isNumber
            };

            testCases.forEach(testCase => {
                expect(() => new TestClass(testCase)).to.throw(Error);
            });
        });
    });
});

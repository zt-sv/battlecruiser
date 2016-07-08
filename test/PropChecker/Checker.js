'use strict';

var
    Checker = require('../../lib/PropChecker/Checker'),

    methods = [
        'check'
    ];

describe('Testing "lib/PropChecker/Checker"...', function() {
    describe('public methods', function() {
        it(`should to have public methods: ${methods.map(method => `
        - ` + method)}
        `, function() {
            methods.forEach(function(method) {
                expect(Checker).to.respondTo(method);
            });
        });
    });

    describe('create new checker', function() {
        it('should throw error, when construct without function', function() {
            var
                invalid = [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, regexps);

            invalid.forEach(function(value) {
                expect(() => new Checker(value)).to.throw(Error, 'Class Checker accept only function as argument');
            });
        });

        it('should not throw error, when construct with function', function() {
            var
                valid = [].concat(fns);

            valid.forEach(function(value) {
                expect(() => new Checker(value)).to.not.throw();
            });
        });
    });
});

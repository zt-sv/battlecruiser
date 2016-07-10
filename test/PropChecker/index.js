'use strict';

var
    PropChecker = require('../../lib/PropChecker'),

    methods = [
        'check'
    ];

describe('Testing "lib/PropChecker"...', function() {
    describe('create new PropChecker', function() {
        it('should throw error, when construct without function', function() {
            var
                invalid = [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, regexps);

            invalid.forEach(function(value) {
                expect(() => new PropChecker(value))
                    .to.throw(Error, 'Class PropChecker accept only function as argument');
            });
        });

        it('should not throw error, when construct with function', function() {
            var
                valid = [].concat(fns);

            valid.forEach(function(value) {
                expect(() => new PropChecker(value)).to.not.throw();
            });
        });
    });
});

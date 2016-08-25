'use strict';

var
    Model   = require('../../lib/BaseClasses/Model');

describe('Testing "lib/BaseClasses/Model"...', function() {
    describe('Create model', function() {
        it('should create model', function() {
            var
                Foo = new Model({
                    foo: Model.isString,
                    bar: Model.isNumber
                });

            expect(Foo).to.have.ownProperty('foo');
            expect(Foo).to.have.ownProperty('bar');
        });

        it('should have validation', function() {
            var
                Foo = new Model({
                    foo: Model.isString,
                    bar: Model.isNumber
                });

            expect(() => Foo.foo = 'asdf').to.not.throw();
            expect(() => Foo.bar = 123).to.not.throw();
            expect(() => Foo.foo = 123).to.throw(Error, 'Property "foo"');
            expect(() => Foo.bar = 'asd').to.throw(Error, 'Property "bar"');
        });

        it('should have isolation properties', function() {
            var
                Foo = new Model({
                    foo: Model.isString,
                    bar: Model.isNumber
                }),

                Bar = new Model({
                    foo: Model.isString,
                    bar: Model.isNumber
                });

            Foo.foo = 'first';
            Bar.foo = 'second';

            expect(Foo.foo).to.not.equal(Bar.foo);
        });

        it('default properties', function() {
            var
                DEFAULT_VALUE = 'asd',
                Foo = new Model({
                    foo: Model.isString,
                    bar: Model.isNumber
                }, {
                    foo: DEFAULT_VALUE
                });

            expect(DEFAULT_VALUE).to.be.equal(Foo.foo);
        });
    });
});

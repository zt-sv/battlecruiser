'use strict';

var
    Model   = require('../../lib/BaseClasses/Model');

describe('Testing "lib/BaseClasses/Model"...', function() {
    it('should create empty model', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo();

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance).to.have.ownProperty('bar');
    });

    it('should create model with props', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo({
                foo: '123',
                bar: 123
            });

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance).to.have.ownProperty('bar');
    });

    it('should throw error when property have no type', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: ''
            });

        expect(() => new Foo()).to.throw(Error, 'should have a type');
    });

    it('should have validation', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo();

        expect(() => fooInstance.foo = 'asdf').to.not.throw();
        expect(() => fooInstance.bar = 123).to.not.throw();
        expect(() => fooInstance.foo = 123).to.throw(Error, 'Property "foo"');
        expect(() => fooInstance.bar = 'asd').to.throw(Error, 'Property "bar"');

        expect(() => new Foo({
            foo: '123'
        })).to.not.throw();
        expect(() => new Foo({
            foo: 123
        })).to.throw(Error, 'Property "foo"');
    });


    it('should have isolation properties', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo(),
            barInstance = new Foo();

        fooInstance.foo = 'first';
        barInstance.foo = 'second';

        expect(fooInstance.foo).to.not.equal(barInstance.foo);
    });

    it('default properties', function() {
        var
            DEFAULT_VALUE = 'asd',

            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }, {
                foo: DEFAULT_VALUE
            }),

            fooInstance = new Foo();

        expect(DEFAULT_VALUE).to.be.equal(fooInstance.foo);
    });

    it('should to extend Model', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo();

        expect(fooInstance).to.be.instanceof(Model);
        expect(fooInstance).to.be.instanceof(Foo);
    });
});

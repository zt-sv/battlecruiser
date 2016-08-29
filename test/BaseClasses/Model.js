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

    it('should create empty model through inheritance', function() {
        class Foo extends Model {}

        Foo.attrs = {
            foo: Model.isString,
            bar: Model.isNumber
        };

        var
            fooInstance = new Foo();

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance).to.have.ownProperty('bar');
    });

    it('should create model with attributes', function() {
        const
            FOO_VALUE = '123',
            BAR_VALUE = 123;

        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo({
                foo: FOO_VALUE,
                bar: BAR_VALUE
            });

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance.foo).to.be.equal(FOO_VALUE);
        expect(fooInstance).to.have.ownProperty('bar');
        expect(fooInstance.bar).to.be.equal(BAR_VALUE);
    });

    it('should create model with attributes through inheritance', function() {
        class Foo extends Model {}

        Foo.attrs = {
            foo: Model.isString,
            bar: Model.isNumber
        };

        const
            FOO_VALUE = '123',
            BAR_VALUE = 123;

        var
            fooInstance = new Foo({
                foo: FOO_VALUE,
                bar: BAR_VALUE
            });

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance.foo).to.be.equal(FOO_VALUE);
        expect(fooInstance).to.have.ownProperty('bar');
        expect(fooInstance.bar).to.be.equal(BAR_VALUE);

        fooInstance.foo = '123123123123';
        expect(fooInstance.foo).to.be.equal('123123123123');
    });

    it('should override default values', function() {
        class Foo extends Model {}

        Foo.attrs = {
            foo: Model.isString,
            bar: Model.isNumber
        };

        const
            FOO_VALUE = '123',
            BAR_VALUE = 123,
            FOO_ANOTHER_VALUE = '456';

        var
            fooInstance = new Foo({
                foo: FOO_VALUE,
                bar: BAR_VALUE
            });

        expect(fooInstance).to.have.ownProperty('foo');
        expect(fooInstance.foo).to.be.equal(FOO_VALUE);

        fooInstance.foo = FOO_ANOTHER_VALUE;
        expect(fooInstance.foo).to.be.equal(FOO_ANOTHER_VALUE);
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

        // console.log(fooInstance.__lookupGetter__('foo').__UUID);
        // console.log(Object.getOwnPropertyDescriptor(fooInstance, 'foo').get.__UUID);
        // console.log(fooInstance.foo);
        // console.log(barInstance.__lookupGetter__('foo').__UUID);

        fooInstance.foo = 'first';
        barInstance.foo = 'second';

        expect(fooInstance.foo).to.not.equal(barInstance.foo);
    });

    it('should be not extensible', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber
            }),

            fooInstance = new Foo({
                foo: '123',
                bar: 123
            });

        expect(() => fooInstance.gggg = '123').to.throw(TypeError, 'object is not extensible');
    });

    it('should accept default properties', function() {
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

    it('should create model with default attributes through inheritance', function() {
        const
            DEFAULT_VALUE = 'asd';

        class Foo extends Model {}

        Foo.attrs = {
            foo: Model.isString,
            bar: Model.isNumber
        };

        Foo.defaultValues = {
            foo: DEFAULT_VALUE
        };

        var
            fooInstance = new Foo();

        expect(DEFAULT_VALUE).to.be.equal(fooInstance.foo);
    });

    it('should to be instance of Model', function() {
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

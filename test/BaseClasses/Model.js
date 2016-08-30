'use strict';

var
    Model   = require('../../lib/BaseClasses/Model');

describe('Testing "lib/BaseClasses/Model"...', function() {
    describe('inheritance', function() {
        it('should to be instance of Model', function() {
            class Bar extends Model {}

            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: Model.isNumber
                }),

                barInstance = new Bar(),
                fooInstance = new Foo();

            expect(fooInstance).to.be.instanceof(Model);
            expect(fooInstance).to.be.instanceof(Foo);
            expect(barInstance).to.be.instanceof(Model);
            expect(barInstance).to.be.instanceof(Bar);
        });

        it('constructor name should to be not configurable', function() {
            class Bar extends Model {}

            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: Model.isNumber
                }),

                barInstance = new Bar(),
                fooInstance = new Foo();

            expect(fooInstance.constructor.name).to.be.equal('Foo');
            expect(() => fooInstance.constructor.name = '123').to.throw(TypeError);
            expect(barInstance.constructor.name).to.be.equal('Bar');
            expect(() => barInstance.constructor.name = '123').to.throw(TypeError);
        });
    });

    describe('model creation', function() {
        it('should create empty model without attributes', function() {
            var
                Foo = Model.create('Foo');

            expect(() => new Foo()).to.not.throw();
        });

        it('should create empty model without attributes through inheritance', function() {
            class Foo extends Model {}

            expect(() => new Foo()).to.not.throw();
        });

        it('should create empty model with attributes', function() {
            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: Model.isNumber
                }),

                fooInstance = new Foo();

            expect(fooInstance).to.have.ownProperty('foo');
            expect(fooInstance.constructor.name).to.be.equal('Foo');
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

        it('should throw error when property have no type', function() {
            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: ''
                });

            expect(() => new Foo()).to.throw(Error, 'should have a type');
        });
    });

    describe('model validation', function() {
        it('should have validation', function() {
            class Bar extends Model {}

            Bar.attrs = {
                foo: [Model.isRequired, Model.isString],
                bar: Model.isNumber
            };

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

            expect(() => new Bar({
                bar: 123
            })).to.throw(Error, 'Property "foo"');

            expect(() => new Bar({
                foo: [],
                bar: 123
            })).to.throw(Error, 'Property "foo"');

            expect(() => new Foo({
                foo: '123'
            })).to.not.throw();
            expect(() => new Foo({
                foo: 123
            })).to.throw(Error, 'Property "foo"');
        });

        it('should have validation for complex objects', function() {
            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: Model.isNumber,
                    internalObj: {
                        foo: Model.isString,
                        bar: Model.isNumber,
                        deepObj: {
                            anotherKey: Model.isBoolean
                        }
                    }
                }),

                fooInstance = new Foo();

            expect(() => fooInstance.foo = 'asdf').to.not.throw();
            expect(() => fooInstance.bar = 123).to.not.throw();
            expect(() => fooInstance.foo = 123).to.throw(Error, 'Property "foo"');
            expect(() => fooInstance.bar = 'asd').to.throw(Error, 'Property "bar"');

            expect(() => fooInstance.internalObj = {}).to.not.throw();
            expect(() => fooInstance.internalObj = '123').to.throw(Error, 'Property "internalObj" must be Object, but got');
            expect(() => fooInstance.internalObj = {
                foo: 'asdf'
            }).to.not.throw();
            expect(() => fooInstance.internalObj = {
                foo: 123123
            }).to.throw();
            expect(() => fooInstance.internalObj.deepObj = {
                anotherKey: 123123
            }).to.throw(Error, 'Property "anotherKey"');
            expect(() => fooInstance.internalObj.deepObj = {
                anotherKey: false
            }).to.not.throw();
            expect(() => fooInstance.internalObj.foo = 'asdf').to.not.throw();
            expect(() => fooInstance.internalObj.bar = 123).to.not.throw();
            expect(() => fooInstance.internalObj.foo = 123).to.throw(Error, 'Property "foo"');
            expect(() => fooInstance.internalObj.bar = 'asd').to.throw(Error, 'Property "bar"');
        });
    });

    describe('model should be not extensible', function() {
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

        it('empty model should be not extensible', function() {
            class Bar extends Model {}

            var
                Foo = Model.create('Foo'),
                barInstance = new Bar(),
                fooInstance = new Foo();

            expect(() => fooInstance.gggg = '123').to.throw(TypeError, 'object is not extensible');
            expect(() => barInstance.gggg = '123').to.throw(TypeError, 'object is not extensible');
        });

        it('deep object in model should be not extensible', function() {
            var
                Foo = Model.create('Foo', {
                    foo: Model.isString,
                    bar: Model.isNumber,
                    internalObj: {
                        foo: Model.isString,
                        bar: Model.isNumber,
                        deepObj: {
                            anotherKey: Model.isBoolean
                        }
                    }
                }),

                fooInstance = new Foo();

            expect(() => fooInstance.internalObj = {
                foo2: 123123
            }).to.throw(TypeError, 'object is not extensible');

            expect(() => fooInstance.internalObj.deepObj = {
                foo: 123123
            }).to.throw(TypeError, 'object is not extensible');
        });
    });

    describe('default params', function() {
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

        it('should validate default values', function() {
            class Foo extends Model {}

            Foo.attrs = {
                foo: Model.isString,
                bar: Model.isNumber
            };

            const
                FOO_VALUE = '123',
                BAR_VALUE = 123;

            expect(() => {
                new Foo({
                    foo: BAR_VALUE,
                    bar: FOO_VALUE
                });
            }).to.throws(Error);
        });
    });

    it('should have isolation properties', function() {
        var
            Foo = Model.create('Foo', {
                foo: Model.isString,
                bar: Model.isNumber,
                internalObj: {
                    foo: Model.isString,
                    bar: Model.isNumber
                }
            }),

            fooInstance = new Foo(),
            barInstance = new Foo();

        fooInstance.foo = 'first';
        fooInstance.internalObj.foo = 'first2';
        barInstance.foo = 'second';

        expect(fooInstance.foo).to.not.equal(barInstance.foo);
        expect(fooInstance.foo).to.not.equal(fooInstance.internalObj.foo);
    });
});

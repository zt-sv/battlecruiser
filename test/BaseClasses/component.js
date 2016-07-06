'use strict';

var
    chai       = require('chai'),
    BaseClass  = require('../../lib/BaseClasses/BaseClass'),
    Component  = require('../../lib/BaseClasses/Component'),
    expect     = chai.expect,
    should     = chai.should(),

    methods    = [
        'disableCachingTemplates',
        'enableCachingTemplates',
        'declareDependencies',
        'declareSources',
        'getRawTemplate',
        'getCompiledTemplate',
        'compilePartials',
        'getClientTemplates',
        'render',
        'getData',
        'onResponse'
    ],

    properties = [
        'templatePath',
        'templateСompiler',
        'partials',
        'clientTemplates',
        'data'
    ];

describe('Testing "Component"...', function() {
    describe('inheritance', function() {
        it('should to extend BaseClass', function() {
            var
                component = new Component();

            expect(component).to.be.instanceof(Component);
            expect(component).to.be.instanceof(BaseClass);
        });
    });

    describe('public properties and methods', function() {
        it(`should to have public methods: ${methods.map(method => `
        - ` + method)}
        `, function() {
            methods.forEach(function(method) {
                expect(Component).to.respondTo(method);
            });
        });

        it(`should to have public properties: ${properties.map(prop => `
        - ` + prop)}
        `, function() {
            var
                component = new Component();

            properties.forEach(function(prop) {
                expect(component).to.have.property(prop);
            });
        });
    });

    describe('property "templatePath"', function() {
        it('should return a string', function() {
            var
                component = new Component();

            expect(component.templatePath).to.be.a('string');
        });

        it('should have setter and getter', function() {
            var
                component = new Component(),
                string    = 'somestring';

            component.templatePath = string;

            expect(component.templatePath).to.be.equal(string);
        });

        it('should take only "string"', function() {
            var
                component = new Component(),
                values    = [
                    true,
                    {}, // object
                    123, // number
                    [] // array
                ],
                testValue = value => component.templatePath = value;

            values.forEach(function(value) {
                expect(testValue.bind(null, value)).to.throw('Property "templatePath" takes only string value');
            });
        });
    });

    /**
     * @TODO: test other properties
     */
    describe('property "templateСompiler"', function() {
    });
    describe('property "partials"', function() {
    });
    describe('property "clientTemplates"', function() {
    });
    describe('property "data"', function() {
    });

    /**
     * @TODO: test methods
     */
    describe('method "disableCachingTemplates"', function() {
    });
    describe('method "enableCachingTemplates"', function() {
    });
    describe('method "declareDependencies"', function() {
    });
    describe('method "declareSources"', function() {
    });
    describe('method "getRawTemplate"', function() {
    });
    describe('method "getCompiledTemplate"', function() {
    });
    describe('method "compilePartials"', function() {
    });
    describe('method "getClientTemplates"', function() {
    });
    describe('method "render"', function() {
    });
    describe('method "getData"', function() {
    });
    describe('method "onResponse"', function() {
    });
});

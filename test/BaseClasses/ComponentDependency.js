'use strict';

var
    ComponentDependency = require('../../lib/BaseClasses/ComponentDependency'),
    Component           = require('../../lib/BaseClasses/Component/index'),
    Model               = require('../../lib/BaseClasses/Model'),

    properties          = [
        'alias',
        'options',
        'component',
        'instance',
        'relatesToYield'
    ],

    validDeclaration    = [
        {
            component: Component
        },
        {
            alias:     'asd',
            component: Component
        },
        {
            alias:     'asd',
            component: Component,
            options:   {}
        },
        {
            alias:     'asd',
            component: Component,
            options:   {},
            instance:  new Component({})
        },
        {
            alias:          'asd',
            component:      Component,
            options:        {},
            relatesToYield: 'someYield'
        }
    ],

    invalidDeclaration  = [
        {},
        {
            component: 'string'
        },
        {
            alias:     {},
            component: Component
        },
        {
            alias:     'as',
            component: Component,
            options:   'string'
        },
        {
            alias:          'as',
            component:      Component,
            options:        {},
            relatesToYield: {}
        },
        {
            alias:          'as',
            component:      Component,
            options:        {},
            relatesToYield: 'string',
            instance:       Component
        }
    ];

describe('Testing "lib/BaseClasses/ComponentDependency"...', function() {
    describe('inheritance', function() {
        it('should to extend BaseClass', function() {
            var
                dep = new ComponentDependency(validDeclaration[0]);

            expect(dep).to.be.instanceof(ComponentDependency);
            expect(dep).to.be.instanceof(Model);
        });
    });

    describe('public properties and methods', function() {
        it(`should to have public properties: ${properties.map(prop => `
        - ` + prop)}
        `, function() {
            var
                dep = new ComponentDependency(validDeclaration[0]);

            properties.forEach(function(prop) {
                expect(dep).to.have.property(prop);
            });
        });
    });

    describe('instance component dependency', function() {
        it('should no throw error when values is valid', function() {
            validDeclaration.forEach(value => {
                expect(() => new ComponentDependency(value)).to.not.throw();
            });
        });

        it('should throw error when values is invalid', function() {
            invalidDeclaration.forEach(value => {
                expect(() => new ComponentDependency(value)).to.throw(Error, 'Property');
            });
        });

    });
});

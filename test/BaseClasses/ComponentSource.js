'use strict';

var
    ComponentSource    = require('../../lib/BaseClasses/ComponentSource'),
    Source             = require('../../lib/BaseClasses/Source'),
    Model              = require('../../lib/BaseClasses/Model'),

    properties         = [
        'name',
        'source',
        'options'
    ],

    validDeclaration   = [
        {
            source: Source
        },
        {
            name:   'asd',
            source: Source
        },
        {
            name:    'asd',
            source:  Source,
            options: {}
        },
        {
            name:    'asd',
            source:  Source,
            options: {}
        }
    ],

    invalidDeclaration = [
        {},
        {
            source: 'string'
        },
        {
            name:   {},
            source: Source
        },
        {
            name:    'as',
            source:  Source,
            options: 'string'
        }
    ];

describe('Testing "lib/BaseClasses/ComponentSource"...', function() {
    describe('inheritance', function() {
        it('should to extend BaseClass', function() {
            var
                source = new ComponentSource(validDeclaration[0]);

            expect(source).to.be.instanceof(ComponentSource);
            expect(source).to.be.instanceof(Model);
        });
    });

    describe('public properties and methods', function() {
        it(`should to have public properties: ${properties.map(prop => `
        - ` + prop)}
        `, function() {
            var
                source = new ComponentSource(validDeclaration[0]);

            properties.forEach(function(prop) {
                expect(source).to.have.property(prop);
            });
        });
    });

    describe('instance component dependency', function() {
        it('should no throw error when values is valid', function() {
            validDeclaration.forEach(value => {
                expect(() => new ComponentSource(value)).to.not.throw();
            });
        });

        it('should throw error when values is invalid', function() {
            invalidDeclaration.forEach(value => {
                expect(() => new ComponentSource(value)).to.throw(Error, 'Property');
            });
        });

    });
});

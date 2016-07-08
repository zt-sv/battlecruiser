'use strict';

var
    BaseClass        = require('../../lib/BaseClasses/BaseClass'),
    Battlecruiser    = require('../../lib/BaseClasses/Battlecruiser'),

    staticProps = [
        'PropChecker',
        'Component',
        'Controller',
        'Source',
        'SourceRepository',
        'SourceResponse'
    ];

describe('Testing "lib/BaseClasses/Battlecruiser"...', function() {
    describe('inheritance', function() {
        it('should to extend BaseClass', function() {
            var
                app = new Battlecruiser();

            expect(app).to.be.instanceof(Battlecruiser);
            expect(app).to.be.instanceof(BaseClass);
        });
    });

    describe('public static properties', function() {
        it(`should to have static properties: ${staticProps.map(prop => `
        - ` + prop)}
        `, function() {
            staticProps.forEach(prop => {
                expect(Battlecruiser).itself.to.respondTo(prop);
            });
        });
    });
});

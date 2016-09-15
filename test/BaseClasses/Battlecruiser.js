'use strict';

var
    BaseClass        = require('../../lib/BaseClasses/BaseClass'),
    Battlecruiser    = require('../../lib/Battlecruiser'),

    staticProps = [
        'PropChecker',
        'Component',
        'Controller',
        'Source',
        'SourceRepository',
        'SourceResponse'
    ];

describe('Testing "lib/BaseClasses/Battlecruiser"...', function() {
    describe('public static properties', function() {
        it(`should to have static properties: ${staticProps.map(prop => `
        - ` + prop)}
        `, function() {
            staticProps.forEach(prop => {
                expect(Battlecruiser).hasOwnProperty(prop);
            });
        });
    });
});

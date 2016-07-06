'use strict';

var
    chai             = require('chai'),
    BaseClass        = require('../../lib/BaseClasses/BaseClass'),
    Battlecruiser    = require('../../lib/BaseClasses/Battlecruiser'),
    Component        = require('../../lib/BaseClasses/Component'),
    Controller       = require('../../lib/BaseClasses/Controller'),
    Source           = require('../../lib/BaseClasses/Source'),
    SourceRepository = require('../../lib/BaseClasses/SourceRepository'),
    SourceResponse   = require('../../lib/BaseClasses/SourceResponse'),
    expect           = chai.expect,
    should           = chai.should(),

    staticProps = {
        'Component':        Component,
        'Controller':       Controller,
        'Source':           Source,
        'SourceRepository': SourceRepository,
        'SourceResponse':   SourceResponse
    };

describe('Testing "Battlecruiser"...', function() {
    describe('inheritance', function() {
        it('should to extend BaseClass', function() {
            var
                app = new Battlecruiser();

            expect(app).to.be.instanceof(Battlecruiser);
            expect(app).to.be.instanceof(BaseClass);
        });
    });

    describe('public static properties', function() {
        it(`should to have static properties: ${Object.keys(staticProps).map(prop => `
        - ` + prop)}
        `, function() {
            for (let prop in staticProps) {
                expect(Battlecruiser).itself.to.respondTo(prop);

                expect(new Battlecruiser[prop]()).to.be.instanceof(BaseClass);
                expect(new Battlecruiser[prop]()).to.be.instanceof(staticProps[prop]);
            }
        });
    });
});

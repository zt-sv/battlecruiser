'use strict';

var
    chai    = require('chai'),
    spies   = require('chai-spies'),
    logger  = require('../../lib/logger'),
    config  = require('../../lib/config'),
    expect  = chai.expect,
    should  = chai.should(),

    methods = [
        'log',
        'info',
        'error'
    ];

chai.use(spies);

describe('Testing "logger"...', function() {
    describe('public properties and methods', function() {
        it(`should to have public methods: ${methods.map(method => `
        - ` + method)}
        `, function() {
            methods.forEach(function(method) {
                expect(logger).to.have.property(method);
                expect(logger[method]).to.be.a('function');
            });
        });
    });

    describe('logging', function() {
        it('methods should logging in console, when configuration "debugEnable" flag is true', function() {
            config.debugEnable = true;

            methods.forEach(function(method) {
                var
                    originalLog   = console.log,
                    randomMessage = Math.random().toString(36).substring(7);

                console.log = chai.spy();
                logger[method](randomMessage);
                expect(console.log).to.have.been.called.once().with(randomMessage);
                console.log = originalLog;
            });
        });

        it('methods should not logging in console, when configuration "debugEnable" flag is false', function() {
            config.debugEnable = false;

            methods.forEach(function(method) {
                var
                    originalLog   = console.log,
                    randomMessage = Math.random().toString(36).substring(7);

                console.log = chai.spy();
                logger[method](randomMessage);
                expect(console.log).to.not.have.been.called();
                console.log = originalLog;
            });
        });
    });
});

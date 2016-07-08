'use strict';

var
    cache  = require('../../lib/cache'),

    methods = [
        'create'
    ];

describe('Testing "cache"...', function() {
    describe('public properties and methods', function() {
        it(`should to have public methods: ${methods.map(method => `
        - ` + method)}
        `, function() {
            methods.forEach(function(method) {
                expect(cache).to.have.property(method);
                expect(cache[method]).to.be.a('function');
            });
        });
    });

    describe('method "create"', function() {
        it('should return "Object"', function() {
            var
                store = cache.create('newStore');

            expect(store).to.be.an('object');
        });

        it('should return link to store', function() {
            var
                store       = cache.create('newStore'),
                secondStore = cache.create('newStore'),
                key         = 'randomValue';

            // Generate random value
            store[key] = Math.random().toString(36).substring(7);

            expect(secondStore[key]).to.be.equal(store[key]);
        });
    });
});

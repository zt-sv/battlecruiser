/**
 * @module lib/cache
 */
'use strict';

var
    stores = {},

    /**
     * Create cache store
     *
     * @param   {string}  storeName     Name for the store
     *
     * @returns {Object}                Exiting or created store
     */
    create = function(storeName) {
        if (stores.hasOwnProperty(storeName)) {
            return stores[storeName];
        }

        return stores[storeName] = {};
    };

module.exports = {
    create: create
};

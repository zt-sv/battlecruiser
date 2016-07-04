/**
 * @module lib/cache
 */
'use strict';

var
    stores = {},

    /**
     * Create cache store
     *
     * @param   {string}  storeName
     * @return  {Object}
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

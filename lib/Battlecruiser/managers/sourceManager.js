/**
 * @module      lib/Battlecruiser/managers/sourceManager
 *
 * @requires    lib/Battlecruiser/managers/helpers
 */
'use strict';

var
    helpers    = require('./helpers'),

    storage = {};

module.exports = {

    /**
     * Extract and register sources from path
     *
     * @async
     *
     * @param  {Object}     options
     * @param  {string}     options.root        Root path
     * @param  {string}     options.prefix      Source prefix
     * @param  {Function}   callback
     */
    extractAndRegister: (options, callback) => helpers.extractAndRegister(Object.assign(options, {
        mode: helpers.MODE.SOURCE,
        storage: storage
    }), callback),

    /**
     * Get source by name
     *
     * @param   {String}    sourceName   Source name
     *
     * @throws  {Error}     Throw error when source with name is not registered
     *
     * @return  {Source}    source class
     */
    getSource: (sourceName) => {
        let
            Source = storage[sourceName];

        if (!Source) {
            // @todo: log this error
            throw Error(`Source ${sourceName} is not registered`);
        } else {
            return Source;
        }
    }
};

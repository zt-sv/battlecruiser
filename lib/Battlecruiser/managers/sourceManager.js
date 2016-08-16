/**
 * @module      lib/Battlecruiser/managers/sourceManager
 *
 * @requires    lib/Battlecruiser/managers/helpers
 */
'use strict';

var
    helpers    = require('./helpers'),

    registered = {};

module.exports = {

    /**
     * Extract and register sources from path
     *
     * @async
     *
     * @param  {Object}     options
     * @param  {string}     options.root
     * @param  {string}     options.prefix
     * @param  {Function}   callback
     */
    extractAndRegister: (options, callback) => {
        // @todo: validate options
        var
            root   = options.root,
            prefix = options.prefix;

        helpers.walk(root, (path, sourceName) => {
            var
                alias = (prefix && prefix !== '') ? `${prefix}/${sourceName}` : sourceName;

            try {
                registered[alias]            = require(path);
                registered[alias].registered = true;
                registered[alias].sourcePath = path;

                // @todo: validate required source: it should be instance of `Source` class
            } catch (err) {
                // @todo: log this warning
                console.warn(`Directory ${file} has no sources`);
            }
        }, callback);
    },

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
            Source = registered[sourceName];

        if (!Source) {
            // @todo: log this error
            throw Error(`Source ${sourceName} is not registered`);
        } else {
            return Source;
        }
    }
};

/**
 * @module      lib/Battlecruiser/managers/helpers
 *
 * @requires    fs
 * @requires    path
 */
'use strict';

var
    Component = require('../../BaseClasses/Component'),
    Source    = require('../../BaseClasses/Source'),
    fs        = require('fs'),
    path      = require('path'),

    MODE      = {
        COMPONENT: 'COMPONENT',
        SOURCE:    'SOURCE'
    },

    /**
     * Iterate directories in path
     *
     * @async
     *
     * @param {string}      root
     * @param {Function}    iterator    Call for each directory in path
     * @param {Function}    callback    Call when all directories iterated
     */
    walk      = (root, iterator, callback) => {
        fs.readdir(root, (err, list) => {
            let
                pending;

            if (err) {
                return callback();
            }

            pending = list.length;

            if (!pending) {
                return callback();
            }

            list.forEach(filename => {
                var
                    file = path.resolve(root, filename);

                fs.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        iterator(file, filename);
                    }

                    if (!--pending) {
                        return callback();
                    }
                });
            });
        });
    };

module.exports = {
    MODE: MODE,

    /**
     * Extract and register components from path
     *
     * @async
     *
     * @param  {Object}     options
     * @param  {string}     options.root        Root path
     * @param  {Object}     options.storage     Storage for registered entities
     * @param  {string}     options.prefix      Entities prefix
     * @param  {string}     options.mode        What type of entities we have to extract
     * @param  {Function}   callback
     */
    extractAndRegister: (options, callback) => {
        var
            root    = options.root,
            storage = options.storage,
            mode    = options.mode,
            prefix  = options.prefix;

        walk(root, (filename, name) => {
            var
                alias = (prefix && prefix !== '') ? `${prefix}/${name}` : name;

            try {
                storage[alias]            = require(filename);
                storage[alias].registered = true;
                storage[alias].path       = filename;
            } catch (err) {
                // @todo: log this warning
                switch (mode) {
                    case MODE.COMPONENT:
                        console.warn(`Directory ${filename} has no components`, err);
                        break;
                    case MODE.SOURCE:
                        console.warn(`Directory ${filename} has no sources`, err);
                        break;
                }
            }
        }, callback);
    }
};

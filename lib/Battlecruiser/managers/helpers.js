/**
 * @module      lib/Battlecruiser/managers/helpers
 *
 * @requires    fs
 * @requires    path
 */
'use strict';

var
    fs   = require('fs'),
    path = require('path');

module.exports = {

    /**
     * Iterate directories in path
     *
     * @async
     *
     * @param {string}      path
     * @param {Function}    iterator    Call for each directory in path
     * @param {Function}    callback    Call when all directories iterated
     */
    walk: (path, iterator, callback) => {
        // @todo: validate params
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
                        iterator(path, filename);

                        if (!--pending) {
                            return callback();
                        }
                    }

                    if (!--pending) {
                        return callback();
                    }
                });
            });
        });
    }
};

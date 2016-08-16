/**
 * @module      lib/Battlecruiser/managers/componentManager
 *
 * @requires    lib/Battlecruiser/managers/helpers
 */
'use strict';

var
    helpers    = require('./helpers'),

    registered = {};

module.exports = {

    /**
     * Extract and register components from path
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

        helpers.walk(root, (path, componentName) => {
            var
                alias = (prefix && prefix !== '') ? `${prefix}/${componentName}` : componentName;

            try {
                registered[alias]               = require(path);
                registered[alias].registered    = true;
                registered[alias].componentPath = path;

                // @todo: validate required component: it should be instance of `Component` class
            } catch (err) {
                // @todo: log this warning
                console.warn(`Directory ${file} has no components`);
            }
        }, callback);
    },

    /**
     * Get component by name
     *
     * @param   {String}    componentName   Component name
     *
     * @throws  {Error}     Throw error when component with name is not registered
     *
     * @return  {Component} component class
     */
    getComponent: (componentName) => {
        let
            Component = registered[componentName];

        if (!Component) {
            // @todo: log this error
            throw Error(`Component ${componentName} is not registered`);
        } else {
            return Component;
        }
    }
};

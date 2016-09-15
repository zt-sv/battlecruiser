/**
 * @module      lib/Battlecruiser/managers/componentManager
 *
 * @requires    lib/Battlecruiser/managers/helpers
 */
'use strict';

var
    helpers    = require('./helpers'),

    storage = {};

module.exports = {

    /**
     * Extract and register components from path
     *
     * @async
     *
     * @param  {Object}     options
     * @param  {string}     options.root        Root path
     * @param  {string}     options.prefix      Components prefix
     * @param  {Function}   callback
     */
    extractAndRegister: (options, callback) => helpers.extractAndRegister(Object.assign(options, {
        mode: helpers.MODE.COMPONENT,
        storage: storage
    }), callback),

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
            Component = storage[componentName];

        if (!Component) {
            // @todo: log this error
            // throw Error(`Component ${componentName} is not registered`);
            return null;
        } else {
            return Component;
        }
    }
};

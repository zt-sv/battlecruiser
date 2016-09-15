/**
 * @module      lib/Battlecruiser
 *
 * @require     async
 * @require     lib/PropChecker
 * @require     lib/BaseClasses/BaseClass
 * @require     lib/BaseClasses/Component
 * @require     lib/BaseClasses/Controller
 * @require     lib/BaseClasses/Source
 * @require     lib/BaseClasses/SourceRepository
 * @require     lib/BaseClasses/SourceResponse
 * @require     lib/Battlecruiser/componentManager
 */
'use strict';

var
    async            = require('async'),
    PropChecker      = require('./../PropChecker'),
    BaseClass        = require('./../BaseClasses/BaseClass'),
    Component        = require('./../BaseClasses/Component'),
    Controller       = require('./../BaseClasses/Controller'),
    Source           = require('./../BaseClasses/Source'),
    SourceResponse   = require('./../BaseClasses/SourceResponse'),

    componentManager = require('./managers/componentManager'),
    sourceManager    = require('./managers/sourceManager'),

    Battlecruiser    = {};

/**
 * Initialize
 * @param {Object}                          options
 * @param {string|Array<componentsRoot>}    options.componentsRoot
 * @param {string|Array<sourcesRoot>}       options.sourcesRoot
 * @param {Function}                        callback
 */
Battlecruiser.initialize = function(options, callback) {
    var

        /**
         * @typedef     componentsRoot
         * @type        {Object}
         * @property    {string}    prefix  Prefix path
         * @property    {string}    path    Path to components root
         */
        componentsRoot               = options.componentsRoot,

        /**
         * @typedef     sourcesRoot
         * @type        {Object}
         * @property    {string}    prefix  Prefix path
         * @property    {string}    root    Path to source root
         */
        sourcesRoot                  = options.sourcesRoot,
        extractAndRegisterComponents = componentManager.extractAndRegister,
        extractAndRegisterSource     = sourceManager.extractAndRegister,
        tasks                        = [];

    switch (Object.prototype.toString.call(componentsRoot)) {
        case '[object Array]':
            componentsRoot.forEach(el => {
                tasks.push(extractAndRegisterComponents.bind(null, el));
            });

            break;

        case '[object String]':
            tasks.push(extractAndRegisterComponents.bind(null, {
                root: componentsRoot
            }));

            break;

        default:
            throw Error('Property "componentsRoot" must be a string or an array');
    }

    switch (Object.prototype.toString.call(sourcesRoot)) {
        case '[object Array]':
            sourcesRoot.forEach(el => {
                tasks.push(extractAndRegisterComponents.bind(null, el));
            });

            break;

        case '[object String]':
            tasks.push(extractAndRegisterSource.bind(null, {
                root: sourcesRoot
            }));

            break;

        default:
            throw Error('Property "sourcesRoot" must be a string or an array');
    }

    async.parallel(tasks, callback);
};

/**
 * Link to `PropChecker`
 *
 * @static
 * @memberof    Battlecruiser
 * @property    PropChecker
 * @type        {PropChecker}
 */
Battlecruiser.PropChecker      = PropChecker;

/**
 * Link to `Component` base class
 *
 * @static
 * @memberof    Battlecruiser
 * @property    Component
 * @type        {Component}
 */
Battlecruiser.Component        = Component;

/**
 * Link to `Controller` base class
 *
 * @static
 * @memberof    Battlecruiser
 * @property    Controller
 * @type        {Controller}
 */
Battlecruiser.Controller       = Controller;

/**
 * Link to `Source` base class
 *
 * @static
 * @memberof    Battlecruiser
 * @property    Source
 * @type        {Source}
 */
Battlecruiser.Source           = Source;

/**
 * Link to `SourceResponse` base class
 *
 * @static
 * @memberof    Battlecruiser
 * @property    SourceResponse
 * @type        {SourceResponse}
 */
Battlecruiser.SourceResponse   = SourceResponse;

module.exports = Battlecruiser;

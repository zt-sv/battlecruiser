/**
 * @module      lib/BaseClasses/Component
 *
 * @require     lib/PropChecker
 * @require     lib/BaseClasses/BaseClass
 * @require     lib/BaseClasses/Component
 * @require     lib/BaseClasses/Controller
 * @require     lib/BaseClasses/Source
 * @require     lib/BaseClasses/SourceRepository
 * @require     lib/BaseClasses/SourceResponse
 */
'use strict';

var
    PropChecker      = require('../PropChecker'),
    BaseClass        = require('./BaseClass'),
    Component        = require('./Component'),
    Controller       = require('./Controller'),
    Source           = require('./Source'),
    SourceRepository = require('./SourceRepository'),
    SourceResponse   = require('./SourceResponse');

class Battlecruiser extends BaseClass {

    /**
     * @class       Battlecruiser
     * @constructor
     * @extends     BaseClass
     */
    constructor(options) {
        super(options);
    }
}

Battlecruiser.PropChecker      = PropChecker;
Battlecruiser.Component        = Component;
Battlecruiser.Controller       = Controller;
Battlecruiser.Source           = Source;
Battlecruiser.SourceRepository = SourceRepository;
Battlecruiser.SourceResponse   = SourceResponse;

module.exports = Battlecruiser;

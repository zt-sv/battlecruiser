/*
 *  __       ___ ___       ___  __   __          __   ___  __
 * |__)  /\   |   |  |    |__  /  ` |__) |  | | /__` |__  |__)
 * |__) /~~\  |   |  |___ |___ \__, |  \ \__/ | .__/ |___ |  \
 *
 * Copyright(c) 2016 Aleksandr Zaytsev
 * MIT Licensed
 */
'use strict';

var
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

Battlecruiser.Component = Component;
Battlecruiser.Controller = Controller;
Battlecruiser.Source = Source;
Battlecruiser.SourceRepository = SourceRepository;
Battlecruiser.SourceResponse = SourceResponse;

module.exports = Battlecruiser;

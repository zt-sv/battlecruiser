/**
 * @module      lib/BaseClasses/GraphNode
 *
 * @require     lib/BaseClasses/BaseClass
 */
'use strict';

var
    BaseClass = require('./BaseClass');

class GraphNode extends BaseClass {
    /**
     * @class       GraphNode
     * @constructor
     * @extends     BaseClass
     *
     * @param       {Object} options
     */
    constructor(options) {
        super(options);
    }
}

module.exports = GraphNode;

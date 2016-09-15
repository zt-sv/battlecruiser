/**
 * @module      lib/BaseClasses/Controller
 *
 * @require     async
 * @require     lib/BaseClasses/BaseClass
 * @require     lib/BaseClasses/ComponentResolver
 * @require     lib/Debug
 */
'use strict';

var
    async             = require('async'),
    BaseClass         = require('./BaseClass'),
    ComponentResolver = require('./ComponentResolver'),
    Debug             = require('../Debug');

module.exports = class Controller extends BaseClass {
    /**
     * Base controller
     *
     * @class       Controller
     * @constructor
     * @extends     BaseClass
     *
     * @param   {Object}    req     Request
     * @param   {Object}    res     Response
     * @param   {Function}  next    Call next route
     */
    constructor(req, res, next) {
        super();

        /**
         * Link to request object
         *
         * @property    req
         * @type        {Object}
         */
        this.req = req;

        /**
         * Link to response object
         *
         * @property    res
         * @type        {Object}
         */
        this.res = res;

        /**
         * @property    next
         * @type        {Function}
         */
        this.next = next;

        /**
         * User request context
         *
         * @property    context
         * @type        {Object}
         */
        this.context = this.createContext({});

        /**
         * Link to ComponentResolver instance
         *
         * @property    componentResolver
         * @type        {ComponentResolver}
         */
        this.componentResolver = new ComponentResolver(this.context, this.sendResponse.bind(this));
    }

    /**
     * Create user request context
     * Enrich with debug plugin
     *
     * @method  createContext
     *
     * @param   {Object}  prevContext
     * @returns {Object}
     */
    createContext(prevContext) {
        var
            debugPlugin = new Debug({
                req: this.res,
                res: this.res
            });

        return Object.assign(prevContext, {
            originalRequest: this.req,
            __debug:         debugPlugin
        });
    }

    /**
     * @property    isClientAcceptJSON
     * @type        {Boolean}
     */
    get isClientAcceptJSON() {
        return !!(this.req.headers.hasOwnProperty('accept') && ~this.req.headers.accept.indexOf('/json'));
    }

    /**
     * @method  errorsHandler
     * @async
     *
     * @param   {Error[]}   errors
     * @param   {Function}  callback
     */
    errorsHandler(errors, callback) {
        console.log(errors);

        return callback(null);
    }

    /**
     * Extract data from components and send JSON to client
     *
     * @method  getDataAndSend
     * @async
     *
     * @param   {Object}    component   Resolved component
     * @param   {Function}  done        Callback function
     */
    getDataAndSend(component, done) {
        this.context.__debug.addStartTime('extractData');

        component.getData(data => {
            this.context.__debug.addEndTime('extractData');
            this.res.json(data);
            done();
        });
    }

    /**
     * Render components and send HTML to client
     *
     * @method  renderAndSend
     * @async
     *
     * @param   {Object}    component   Resolved component
     * @param   {Function}  done        Callback function
     */
    renderAndSend(component, done) {
        this.context.__debug.addStartTime('render');

        component.render(tpl => {
            this.context.__debug.addEndTime('render');
            this.res.send(tpl);
            done();
        });
    }

    /**
     * Send response to client
     *
     * @method  sendResponse
     * @async
     *
     * @param   {Array}         errors
     * @param   {Object}        component   Resolved component
     */
    sendResponse(errors, component) {
        async.waterfall(
            [
                this.errorsHandler.bind(this, errors),
                (done) => {
                    if (this.isClientAcceptJSON) {
                        this.getDataAndSend(component, done);
                    } else {
                        this.renderAndSend(component, done);
                    }
                }
            ],
            this.destroy
        );
    }

    /**
     * Destroy controller, clean and remove properties
     *
     * @method destroy
     */
    destroy() {
        this.componentResolver.destroy();

        this.req = null;
        this.res = null;
        this.next = null;
        this.context = null;
        this.componentResolver = null;

        delete this.req;
        delete this.res;
        delete this.next;
        delete this.context;
        delete this.componentResolver;
    }
};

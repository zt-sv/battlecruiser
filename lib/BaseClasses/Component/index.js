/**
 * @module      lib/BaseClasses/Component
 *
 * @require     path
 * @require     fs
 * @require     handlebars
 * @require     async
 * @require     lib/logger
 * @require     lib/config
 * @require     lib/cache
 * @require     lib/BaseClasses/BaseClass
 * @require     lib/BaseClasses/ComponentDependency
 * @require     lib/BaseClasses/ComponentSource
 */
'use strict';

var
    path                = require('path'),
    fs                  = require('fs'),
    handlebars          = require('handlebars'),
    async               = require('async'),
    logger              = require('../../logger/index'),
    config              = require('../../config/index'),
    cache               = require('../../cache/index'),
    BaseClass           = require('./../BaseClass'),
    ComponentDependency = require('./../ComponentDependency'),
    ComponentSource     = require('./../ComponentSource');

const
    DEBUG_ENABLE       = config.debugEnable,
    _dependencies      = Symbol('_dependencies'),
    _sources           = Symbol('_sources'),
    _templatePath      = Symbol('_templatePath'),
    _useTemplatesCache = Symbol('_useTemplatesCache'),
    _templatesCache    = Symbol('_templatesCache'),
    _rawTemplatesCache = Symbol('_rawTemplatesCache');

class Component extends BaseClass {
    /**
     * @class       Component
     * @constructor
     * @extends     BaseClass
     *
     * @param       {Object} options
     * @param       {Object} context
     */
    constructor(options, context) {
        super(options, context);

        /**
         * Default template engine
         *
         * @property    templateEngine
         * @type        {handlebars}
         */
        this.templateEngine = handlebars.create();

        /**
         * Local template partials declaration. Is empty object by default.
         * Should be an object, where the key is the name of partial
         * and the value is the path relative to component root.
         *
         * @example
         * this.partials = {
         *      'foo': 'bar.handlebars'
         * };
         *
         * @property    partials
         * @type        {Object}
         */
        this.partials = {};

        /**
         * Templates, which send to client as string. Is empty object by default.
         * Should be an object, where the key is the name of partial
         * and the value is the path relative to component root.
         *
         * @example
         * this.clientTemplates = {
         *      'foo': 'bar.handlebars'
         * };
         *
         * @property    partials
         * @type        {Object}
         */
        this.clientTemplates = {};

        /**
         * Data which passed to template
         *
         * @property    data
         * @type        {Object}
         */
        this.data = {
            __dependencies: {},
            yields:         {}
        };

        /**
         * Using cache for templates flag.
         * Initial value gives from configuration.
         * You can control caching for the components by `disableCachingTemplates` and `enableCachingTemplates` methods
         *
         * @private
         * @property    _useTemplatesCache
         * @type        {boolean}
         */
        this[_useTemplatesCache] = config.useTemplatesCache;

        /**
         * Path to component main template
         *
         * @private
         * @property    _templatePath
         * @type        {string|null}
         */
        this[_templatePath] = null;

        /**
         * Dependencies private storage
         *
         * @private
         * @property    _dependencies
         * @type        {ComponentDependency[]}
         */
        this[_dependencies] = [];

        /**
         * Sources private storage
         *
         * @private
         * @property    _sources
         * @type        {ComponentSource[]}
         */
        this[_sources] = [];
    }

    /**
     * Link to the template, which use to render component.
     * By default is `%componentPath%/templates/default.handlebars`.
     *
     * @property    templatePath
     * @type        {string}
     */
    get templatePath() {
        var
            defaultPath = `${this.constructor.componentPath || __dirname}/templates/default.handlebars`;

        return this[_templatePath] = this[_templatePath] || defaultPath;
    };

    /**
     * @param   {string}  path
     */
    set templatePath(path) {
        if (typeof path !== 'string') {
            throw new TypeError('Property "templatePath" takes only string value');
        }

        this[_templatePath] = path;
    }

    /**
     * Turn off caching templates for the component
     *
     * @method disableCachingTemplates
     */
    disableCachingTemplates() {
        this[_useTemplatesCache] = false;
    }

    /**
     * Turn on caching templates for the component
     *
     * @method disableCachingTemplates
     */
    enableCachingTemplates() {
        this[_useTemplatesCache] = true;
    }

    /**
     * Dependency declaration. Add new dependencies to component.
     * Can be called a few times.
     *
     * @method declareDependencies
     * @example
     * this.declareDependencies(
     *      {
     *          component: 'Foo',
     *          options: {
     *              foo: 'value'
     *          }
     *      },
     *      {
     *          component: 'Bar',
     *          options: {
     *              bar: 'anotherValue'
     *          }
     *      }
     * );
     *
     * @param   {...Object} dependency              Dependencies list
     * @param   {string}    dependency.component    Dependency name
     * @param   {string}    dependency.alias        Dependency alias
     * @param   {Object}    dependency.options      Dependency options
     */
    declareDependencies(dependency) {
        var
            dependencies = Array.prototype.slice.call(arguments, 0);

        dependencies.forEach(dependency => {
            this[_dependencies].push(
                new ComponentDependency(dependency)
            );
        });
    }

    /**
     * Source declaration. Must be include repository name and params(optional).
     * Can be called only once
     *
     * @example
     * this.declareSources(
     *      {
     *          name: 'FooSource',
     *          options: {
     *              foo: 'bar'
     *      },
     *      {
     *          name: 'AnotherSource'
     *      }
     * );
     *
     * @param   {...Object} source      Sources list
     * @param   {string} source.name    Source name
     * @param   {Object} source.options Source options
     */
    declareSources(source) {
        var
            sources = Array.prototype.slice.call(arguments, 0);

        sources.forEach(source => {
            this[_sources].push(
                new ComponentSource(source)
            );
        });
    }

    /**
     * Get template as text.
     * If caching templates on, put the template text into the cache storage.
     * The cache storage is the single for all components.
     *
     * @method  getRawTemplate
     * @async
     *
     * @param   {string}                            templatePath    Path to template
     * @param   {Component~getRawTemplateCallback}  callback        The callback that handles the raw template
     */
    getRawTemplate(templatePath, callback) {
        /**
         * @callback    Component~getRawTemplateCallback
         *
         * @param       {?Error}   err           Thrown error
         * @param       {?string}  rawTemplate   Template as text
         */

        var
            hasTemplateInCache = this[_rawTemplatesCache].hasOwnProperty(templatePath);

        if (this[_useTemplatesCache] && hasTemplateInCache) {
            return callback(null, this[_rawTemplatesCache][templatePath]);
        }

        fs.readFile(templatePath, 'utf-8', (err, rawTemplate) => {
            if (err) {
                return callback(err, null);
            }

            if (this[_useTemplatesCache]) {
                this[_rawTemplatesCache][templatePath] = rawTemplate;
            }

            callback(null, rawTemplate);
        });
    }

    /**
     * Get compiled template.
     * If caching templates on, put the compiled template into the cache storage.
     * The cache storage is the single for all components.
     *
     * @method  getCompiledTemplate
     * @async
     *
     * @param   {string}                                templatePath    Path to template
     * @param   {Component~getCompiledTemplateCallback} callback        The callback that handles the compiled template
     */
    getCompiledTemplate(templatePath, callback) {
        /**
         * @callback    Component~getCompiledTemplateCallback
         *
         * @param       {?Error}   err       Thrown error
         * @param       {?string}  template  Compiled template as function
         */

        var
            hasTemplateInCache = this[_templatesCache].hasOwnProperty(templatePath);

        if (this[_useTemplatesCache] && hasTemplateInCache) {
            return callback(null, this[_templatesCache][templatePath]);
        }

        this.getRawTemplate(templatePath, (err, rawTemplate) => {
            var
                compiled;

            if (err) {
                return callback(err, null);
            }

            compiled = this.templateEngine.compile(rawTemplate);

            if (this[_useTemplatesCache]) {
                this[_templatesCache][templatePath] = compiled;
            }

            callback(null, compiled);
        });
    }

    /**
     * Compile local template partials
     *
     * @method  compilePartials
     * @async
     *
     * @param   {Component~compilePartialsCallback}  callback
     */
    compilePartials(callback) {
        /**
         * @callback    Component~compilePartialsCallback
         *
         * @param       {?Error}   err       Thrown error
         * @param       {?Object}  partials  Compiled partials as function
         */

        async.forEachOf(this.partials, (value, key, done) => {
            var
                partialPath = path.resolve(`${this.constructor.componentPath || __dirname}/templates/`, value);

            this.getCompiledTemplate(partialPath, (err, partial) => {
                if (err) {
                    return done(err, null);
                }

                this.templateEngine.registerPartial(key, partial);
                done(null, partial);
            });
        }, callback);
    }

    /**
     * Extract client templates from the component and all dependencies
     *
     * @method  getClientTemplates
     * @async
     *
     * @param   {Component~getClientTemplatesCallback}  callback
     */
    getClientTemplates(callback) {
        /**
         * @callback    Component~getClientTemplatesCallback
         *
         * @param       {Object}   clientTemplates      All client templates from component and dependencies
         */

        var
            result = {};

        async.forEachOf(this.clientTemplates, (value, key, done) => {
            var
                templatePath = path.resolve(`${this.constructor.componentPath || __dirname}/templates/`, value);

            this.getRawTemplate(templatePath, (err, rawTemplate) => {
                result[key] = rawTemplate;
                done();
            });
        }, err => {
            if (err) {
                logger.error(`Component ${this.constructor.name} can't get client templates. Error: ${err.toString()}`);

                return callback(result);
            }

            async.each(this[_dependencies], (dep, done) => {
                if (!dep.instance) {
                    logger.error(`Component ${this.constructor.name} dependency ${dep.alias} have no instance.`);

                    return done();
                }

                dep.instance.getClientTemplates(clientTemplates => {
                    Object.assign(result, clientTemplates);
                    done();
                });
            }, () => callback(result));
        });
    }

    /**
     * Render component
     * Also render all dependency components
     * Rendered dependency components pass to template as property `__dependencies.%ComponentName%`
     * or `__dependencies.%ComponentAlias%`
     *
     * @method   render
     * @async
     *
     * @param    {Component~renderCallback}  callback
     */
    render(callback) {
        var

            /**
             * Render all dependencies
             *
             * @param   {Function}    done  Callback
             */
            renderDependencies = done => {
                async.each(this[_dependencies], (dep, cb) => {
                    if (!dep.instance) {
                        logger.error(`Component ${this.constructor.name} dependency ${dep.alias} have no instance.`);

                        return cb();
                    }

                    this.data.yields = this.data.yields || {};
                    this.data.__dependencies = this.data.__dependencies || {};
                    this.data.__dependencies[dep.alias] = this.data.__dependencies[dep.alias] || [];

                    dep.instance.render.call(dep.instance, tpl => {
                        if (dep.relatesToYield) {
                            this.data.yields[dep.relatesToYield] = this.data.yields[dep.relatesToYield] || [];
                            this.data.yields[dep.relatesToYield].push(tpl);
                        }

                        this.data.__dependencies[dep.alias].push(tpl);
                        cb();
                    });
                }, done);
            };

        /**
         * @callback    Component~renderCallback
         *
         * @param       {string}   renderedTemplate      Rendered template
         */

        async.parallel(
            {
                partials: this.compilePartials.bind(this),
                template: this.getCompiledTemplate.bind(this, this.templatePath),
                data:     renderDependencies
            },
            (err, res) => {
                let
                    renderedTemplate = '';

                if (err) {
                    logger.error(`Component ${this.constructor.name} can't render. Error: ${err.toString()}`);

                    renderedTemplate = DEBUG_ENABLE
                        ? `Component ${this.constructor.name} can't render. Error: ${err.toString()}`
                        : '';
                } else {
                    renderedTemplate = res.template(this.data);
                }

                return callback(renderedTemplate);
            }
        );
    }

    /**
     * Extract data from the component and all dependencies
     * Dependencies data pass to result as property `__dependencies.%ComponentName%`
     * or `__dependencies.%ComponentAlias%`
     *
     * @method      getData
     * @async
     *
     * @param       {Component~getDataCallback}  callback
     */
    getData(callback) {
        /**
         * @callback    Component~getDataCallback
         *
         * @param       {Object}   data     Data from component and dependencies
         */

        async.each(this[_dependencies], (dep, cb) => {
            if (!dep.instance) {
                logger.error(`Component ${this.constructor.name} dependency ${dep.alias} have no instance.`);

                return cb();
            }

            this.data.yields = this.data.yields || {};
            this.data.__dependencies = this.data.__dependencies || {};
            this.data.__dependencies[dep.alias] = this.data.__dependencies[dep.alias] || [];

            dep.instance.getData.call(dep.instance, data => {
                this.data.__dependencies[dep.alias].push(data);
                cb();
            });
        }, err => {
            if (err) {
                logger.error(`Component ${this.constructor.name} can't get data. Error: ${err.toString()}`);

                return callback(
                    DEBUG_ENABLE
                        ? err
                        : this.data
                );
            }

            callback(this.data);
        });
    }

    /**
     * On response handler
     *
     * @param {?Error}  error   Error form source
     * @param {?Object} result  Result from source
     */
    onResponse(error, result) {}
}

/**
 * Link to templates cache store
 *
 * @private
 * @memberOf    Component
 * @property    _templatesCache
 * @type        {Object}
 */
Component.prototype[_templatesCache] = cache.create('_templatesCache');

/**
 * Link to raw templates cache store
 *
 * @private
 * @memberOf    Component
 * @property    _rawTemplatesCache
 * @type        {Object}
 */
Component.prototype[_rawTemplatesCache] = cache.create('_rawTemplatesCache');

module.exports = Component;

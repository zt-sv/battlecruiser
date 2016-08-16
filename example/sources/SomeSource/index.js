'use strict';

let
    BC     = require('../../../index'),
    async  = require('async'),
    Source = BC.Source;

module.exports = class SomeSource extends Source {
    /**
     * @class       SomeSource
     * @constructor
     * @extends     Source
     *
     * @param   {Object}    options    Конфигурация источника. Содержит имя репозитория и дополнительные параметры
     */
    constructor(options) {
        super(options);
    }

    /**
     * Выполнение запросов
     *
     * @method  execute
     * @async
     */
    execute(callback) {
        /**
         * @example
            async.auto({
                geo:                this.getGeoRequest.bind(this),
                category:           ['geo', this.getCategoryRequest.bind(this)],
                categoryTree:       ['geo', this.categoryTreeRequest.bind(this)],
                categoryStaticPage: ['geo', 'category', this.categoryStaticPageRequest.bind(this)]
            }, ( err, data ) => {
                let
                    model, error;

                if ( err ) {
                    return callback(err, data);
                }

                callback(error, model);
            });
         *
         */

        callback(null, {
            text: 'some text'
        });
    }
};

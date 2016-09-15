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
     * @param       {Object}    options
     * @param       {string}    options.alias
     * @param       {Component} options.component
     * @param       {number}    options.level
     */
    constructor(options) {
        super(options);

        /**
         * Имя компонента
         *
         * @property    componentName
         * @type        {String}
         */
        this.componentName = options.alias;

        /**
         * Ссылка на компонент
         *
         * @property    component
         * @type        {Object}
         */
        this.component = options.component;

        /**
         * Глубина расположения узла дерева
         *
         * @property    status
         * @type        {Object}
         */
        this.level = options.level;

        /**
         * Текущий статус узла дерева
         *
         * @property    status
         * @type        {Object}
         */
        this.status = GraphNode.STATUS.INITED;

        /**
         * Количество оставшихся источников, из которых необходимо получить данные.
         * Если sources задан непустым объектом, то 1.
         * Если массивом - длинна массива
         *
         * @property    sourcesLeft
         * @type        {Number}
         */
        this.sourcesLeft = 0;

        switch (Object.prototype.toString.call(this.component.sources)) {
            case '[object Array]':
                this.sourcesLeft = this.component.sources.length;
                break;

            case '[object Object]':
                this.sourcesLeft = Object.keys(this.component.sources).length ? 1 : 0;
                break;
        }

        /**
         * Ответ, который поступит в onResponse компоненты
         *
         * @property    resultData
         * @type        {Object}
         */
        this.resultData = {};

        /**
         * Ошибка или массив ошибок, которые поступят в onResponse компоненты
         *
         * @property    resultData
         * @type        {null|Error|Error[]}
         */
        this.resultError = null;
    }

    /**
     * Функция обратного вызова от источника данных
     *
     * @param {Object}  error
     * @param {String}  sourceName
     * @param {Object}  data
     */
    sourceCallback(error, sourceName, data) {
        if (error) {
            if (!this.resultError) {
                this.resultError = [];
            }

            this.resultError.push(error);
        }

        switch (Object.prototype.toString.call(this.component.sources)) {
            case '[object Array]':
                this.resultData[sourceName] = data;
                break;

            case '[object Object]':
                this.resultData = data;
                break;
        }

        if (!--this.sourcesLeft) {
            this.status = STATUS.DATA_RECEIVED;
            this.component.onResponse.call(this.component, this.resultError, this.resultData);
        }
    }
}

GraphNode.STATUS = {
    INITED:         0,
    DATA_RECEIVING: 1,
    DATA_RECEIVED:  2,
    DATA_PREPARED:  3
};

module.exports = GraphNode;

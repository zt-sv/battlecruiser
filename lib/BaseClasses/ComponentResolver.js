/**
 * @module      lib/baseClasses/ComponentResolver
 *
 * @requires    lib/baseClasses/BaseClass
 * @requires    lib/baseClasses/GraphNode
 * @requires    lib/Battlecruiser/managers/componentManager
 */
'use strict';

var
    BaseClass        = require('../baseClasses/BaseClass'),
    GraphNode        = require('../baseClasses/GraphNode'),
    componentManager = require('../Battlecruiser/managers/componentManager');

module.exports = class ComponentResolver extends BaseClass {
    /**
     * @class   ComponentResolver
     * @constructor
     * @extends BaseClass
     *
     * @param  {Object}     context
     * @param  {Function}   callback
     */
    constructor(context, callback) {
        super(arguments);

        /**
         * Граф зависимостей. Каждый уровень графа соответствует индексу массива.
         * Каждый элемент массива является объектом, где ключ явялется именем компонента, а значение объектом,
         * содержащим информацию о компоненте, количестве раз ее вызова и уровне на котором эта зависимость находится
         * Зависимоси из компоненты извлекаюися дважды: сразу после инициализации и сразу после получения первых данны:
         * Некоторые зависимости у компонент могут появится уже после получения данных.
         *
         * @property    graph
         * @type        {Object[]}
         */
        this.graph = [];

        /**
         * User request context
         *
         * @property    context
         * @type        {Object}
         */
        this.context = context;

        /**
         * Ссылка на функцию обратного вызова, переданная в конструктор
         *
         * @property    callback
         * @type        {Function}
         */
        this.callback = callback;

        /**
         * Ошибки разрешения зависимостей
         *
         * @property    errors
         * @type        {Object[]}
         */
        this.errors = [];

        /**
         * Информация о времени выполнения
         *
         * @property    timings
         * @type        {Object}
         */
        this.timings = {
            startResolveComponents: this.nowMs
        };

        /**
         * Количество источников которые находятся в процессе получения данных
         *
         * @property    sourceInProgress
         * @type        {Number}
         */
        this.sourceInProgress = 0;
    }

    /**
     * @method resolve
     *
     * @param {Object}  params
     * @param {string}  params.component
     * @param {Object}  params.options
     */
    resolve(params) {
        this.addComponentToGraph(params.component, params.options, 0);
        this.executeSources();
    }

    /**
     * Добавляем компонент в граф на заданый уровень
     *
     * @method addComponentToGraph
     *
     * @param {String} componentName    Имя компонента
     * @param {Object} params           Параметры с которыми необходимо вызвать компонент
     * @param {Object} parent           Ссылка на родительский компонент
     * @param {Number} level            Уровень на который необходимо добавить компонент
     */
    addComponentToGraph(componentName, params, level) {
        var
            dependencies,
            Component,
            createdComponent;

        if (!this.graph[level]) {
            this.graph[level] = [];
        }

        Component = componentManager.getComponent(componentName);

        if (!Component) {
            this.errorHandler(new Error(`Component "${componentName}" not found`, {
                componentName: componentName,
                params:        params
            }));

            return false;
        }

        try {
            createdComponent = new Component(params, this.context);
        } catch (err) {
            this.errorHandler(err);

            return false;
        }

        createdComponent.onError = this.errorHandler.bind(this);

        /**
         * Добавляем компонент в граф
         */
        this.graph[level].push(new GraphNode({
            alias: componentName,
            component: createdComponent,
            level: level
        }));

        dependencies = createdComponent.dependencies;

        dependencies.forEach(dep => {
            dep.registered = true;
            dep.instance = this.addComponentToGraph(dep.component, dep.params, level + 1);
        });

        return createdComponent;
    }

    /**
     * Обработчик ошибки в компоненте
     *
     * @method  errorHandler
     * @param   {Object|*}    error
     */
    errorHandler(error) {
        this.errors.push(error);
    }

    /**
     * Вызов каждого узла графа. В функцию итератор передается ссылка на компонент
     *
     * @method  runGraph
     *
     * @param   {Function}  iterator    Функция обработчик для каждого из узлов
     */
    runGraph(iterator) {
        this.graph.forEach(level => {
            level.forEach(iterator);
        });
    }

    /**
     * Бежим по дереву и собираем все источники, для которых еще не получили данные
     *
     * @method executeSources
     */
    executeSources() {
        var
            sourceList = [];

        this.runGraph(graphNode => {
            let
                sources;

            // Этот компонент находится в состоянии получения данных или выше
            if (graphNode.status >= GraphNode.STATUS.DATA_RECEIVING) {
                return;
            }

            sources = graphNode.component.sources;

            if (Object.prototype.toString.call(sources) === '[object Array]') {
                sources.forEach(source => {
                    this.sourceInProgress++;
                    this.sourceRepository.addSource(
                        sourceList, source, graphNode, graphNode.sourceCallback.bind(graphNode)
                    );
                });

                graphNode.status = GraphNode.STATUS.DATA_RECEIVING;
            } else if (Object.keys(sources).length) {
                this.sourceInProgress++;
                graphNode.status = GraphNode.STATUS.DATA_RECEIVING;
                this.sourceRepository.addSource(
                    sourceList, sources, graphNode, graphNode.sourceCallback.bind(graphNode)
                );
            } else {
                graphNode.status = GraphNode.STATUS.DATA_RECEIVED;
            }
        });

        /**
         * Если количество источников из которых надо получить данные равно 0 или текущий списко источников из
         * которого надо получить данные пуст - ищем новые зависимости
         */
        if (!this.sourceInProgress || !sourceList.length) {
            return this.findNewDependencies();
        }

        /**
         * Callback срабатывает после каждого успешного завершения получения данных и возвращает элемент графа для
         * которого полученны данные
         */
        this.sourceRepository.getDataFromSources(sourceList, graphNode => {
            this.sourceInProgress--;

            // Если для текущего узла получены все данные из всех источников, то снова начинаем искать новые зависимости
            if (graphNode.status === GraphNode.STATUS.DATA_RECEIVED) {
                this.findNewDependencies();
            }
        });
    }

    /**
     * Дебажная информация. Содержит:
     *  - массив запросов, выполненных sourceRepository
     *  - Построенный граф зависимостей
     *
     * @property    debugInfo
     * @type        {Object}
     */
    get debugInfo() {
        let
            extract = function(component) {
                let
                    dependencies,

                    graphNode = {
                        partials:     component.partials,
                        params:       component.params,
                        data:         component.data,
                        cookies:      component.cookies,
                        templatePath: component.templatePath,
                        dependencies: []
                    };

                dependencies = component.dependencies || [];

                dependencies.forEach(dep => {
                    graphNode.dependencies.push({
                        [dep.component]: extract(dep.instance)
                    });
                });

                return graphNode;
            },

            result  = {};

        if (!configuration.application.debugPanelEnabled) {
            return result;
        }

        this.timings.endResolveComponents = this.nowMs;
        this.timings.startExtractComponentsDebug = this.nowMs;

        result = {
            timings: this.timings,
            queries: this.sourceRepository.debug,
            graph:   {
                [this.rootComponent]: decycleJSON(
                    extract(
                        this.graph[0][0] ? this.graph[0][0].component : {}
                    ),
                    ['originalRequest', 'templateСompiler']
                )
            }
        };

        this.timings.endExtractComponentsDebug = this.nowMs;

        return result;
    }

    /**
     * Повторно проходим по построенному дереву компонентов, обновляем статусы, добавляем новые зависимости
     * @todo    на самом деле это бажная функция. ее не надо вызывать в конструкторе
     *
     * @method findNewDependencies
     */
    findNewDependencies() {
        let
            newDepsAdded = false,
            dependencies = [];

        this.runGraph(graphNode => {
            // Этот компонент не получил данные
            if (graphNode.status !== GraphNode.STATUS.DATA_RECEIVED) {
                return;
            }

            graphNode.status = GraphNode.STATUS.DATA_PREPARED;
            dependencies = graphNode.component.dependencies;

            dependencies.forEach(dep => {
                if (dep.registered) {
                    return;
                }

                newDepsAdded = true;
                dep.registered = true;
                dep.instance = this.addComponentToGraph(
                    dep.component,
                    dep.params,
                    graphNode.level + 1
                );
            });
        });

        /**
         * Если новые зависимости были добавлены, вызываем их источники
         * Если новых зависимостей добавлено небыло возвращаем ссылку на корневой компонент
         */
        if (newDepsAdded) {
            this.executeSources();
        } else if (!this.sourceInProgress) {
            this.callback(this.errors, this.graph[0][0] ? this.graph[0][0].component : null);
            this.destroy();
        }
    }

    /**
     * Вычищаем за собой все созданные свойства и объекты присущие данному экземляру класса
     *
     * @method destroy
     */
    destroy() {
        this.sourceRepository.destroy();

        this.graph = null;
        this.sourceRepository = null;
        this.rootComponent = null;
        this.originalRequest = null;
        this.originalParams = null;
        this.callback = null;
        this.errors = null;
        this.timings = null;

        delete this.graph;
        delete this.sourceRepository;
        delete this.rootComponent;
        delete this.originalRequest;
        delete this.originalParams;
        delete this.callback;
        delete this.errors;
        delete this.timings;
    }
};

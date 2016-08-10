/**
 * @module      lib/BaseClasses/Controller
 *
 * @require     lib/BaseClasses/BaseClass
 */
'use strict';

var
    ComponentResolver = require('./ComponentResolver'),
    BaseClass = require('./BaseClass');

module.exports = class Controller extends BaseClass {
    /**
     * Base controller
     *
     * @class       Controller
     * @constructor
     * @extends     BaseClass
     *
     * @param   {Object}    req     Запрос
     * @param   {Object}    res     Ответ
     * @param   {Function}  next    Функция передачи управления на следующий маршрут
     */
    constructor(req, res, next) {
        super(arguments);

        /**
         * Ссылка на пользовательский запрос
         *
         * @property    req
         * @type        {Object}
         */
        this.req = req;

        /**
         * Ссылка на ответ
         *
         * @property    res
         * @type        {Object}
         */
        this.res = res;

        /**
         * Ссылка на функцию передачи управления на следующий маршрут
         *
         * @property    next
         * @type        {Function}
         */
        this.next = next;

        this.context = this.createContext(req, res);

        this.componentResolver = new ComponentResolver(this.context);
        this.componentResolver.setCallback(this.sendResponse.bind(this));
    }

    createContext(req, res) {
        return {};
    }

    /**
     * Клиент принимает ответ в формате JSON
     *
     * @property    clientAcceptJSON
     * @type        {Boolean}
     */
    get clientAcceptJSON() {
        return !!(this.req.headers.hasOwnProperty('accept') && ~this.req.headers.accept.indexOf('/json'));
    }

    /**
     * Обработка ошибок
     *
     * @method  errorsHandler
     * @param   {Error[]}   errors      Массив ошибок, которые произошли во время разрешения зависимостей
     * @param   {Function}  callback    Функция обратного вызова
     */
    errorsHandler(errors, callback) {
        return callback(null);
    }

    /**
     * Извлечение данных из комопнента и отправка их клиенту
     *
     * @method  getDataAndSend
     * @async
     *
     * @param   {Object}    component   Готовый компонент из которого извлекаем данные
     * @param   {Function}  done        Функция обратного вызова
     */
    getDataAndSend(component, done) {
        component.getData(data => {
            this.res.json(data);
            done();
        });
    }

    /**
     * Отрисовка комопнента и отправка HTML клиенту
     *
     * @method  renderAndSend
     * @async
     *
     * @param   {Object}    component   Готовый компонент который отрисовываем
     * @param   {Function}  done        Функция обратного вызова
     */
    renderAndSend(component, done) {
        component.render(tpl => {
            this.res.send(tpl);
            done();
        });
    }

    /**
     * Отправка ответа пользователю. В зависимости от типа запроса отправляет или данные или отрисованный шаблон.
     * Перед обработкой компонента, запускает обработку ошибок возникших при разрешении зависимостей.
     *
     * @method  sendResponse
     * @async
     *
     * @param   {Array}         errors      Массив ошибок возникших при разрешении зависимости компонента
     * @param   {Object}        component   Ссылка на созданый компонент
     */
    sendResponse(errors, component) {
        async.waterfall([
            this.errorsHandler.bind(this, errors),
            (done) => {
                if (this.clientAcceptJSON) {
                    this.getDataAndSend(component, done);
                } else {
                    this.renderAndSend(component, done);
                }
            }
        ], this.destroy);
    }

    /**
     * @method destroy
     */
    destroy(error) {
        if (error) {
            console.log(error.stack);
        }

        this.req = null;
        this.res = null;
        this.next = null;

        delete this.req;
        delete this.res;
        delete this.next;
    }
};

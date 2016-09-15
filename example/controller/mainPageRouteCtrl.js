'use strict';

var
    BC          = require('../../index'),
    Controller   = BC.Controller,

    TestComponent1 = require('../components/TestComponent1');

class MainPageRouteCtrl extends Controller {
    // конструктор
    constructor(req, res, next) {
        super(req, res, next);

        BC.render(
            {
                component: TestComponent1,
                options: {}
            },
            (err, html) => {
                console.log(err);
                console.log(html)
            }
        );

        this.componentResolver.resolve();
    }
}

module.exports = (req, res, next) => new MainPageRouteCtrl(req, res, next);

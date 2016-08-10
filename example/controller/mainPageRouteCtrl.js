var
    BC          = require('../../index'),
    Controller   = BC.Controller,

    TestComponent1 = require('../components/TestComponent1');

class MainPageRouteCtrl extends Controller {
    // конструктор
    constructor(req, res, next) {
        super(req, res, next);

        this.componentResolver.resolve({
            component: TestComponent1,
            options: {}
        });
    }
}

module.exports = (req, res, next) => new MainPageRouteCtrl(req, res, next);

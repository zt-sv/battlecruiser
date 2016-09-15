'use strict';

var
    BC          = require('../../index'),
    Controller   = BC.Controller;

class MainPageRouteCtrl extends Controller {

    constructor(req, res, next) {
        super(req, res, next);

        this.componentResolver.resolve(
            {
                component: 'TestComponent1',
                options: {}
            },
            (err, html) => {
                console.log(err);
                console.log(html);
            }
        );
    }
}

module.exports = (req, res, next) => new MainPageRouteCtrl(req, res, next);

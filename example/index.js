'use strict';

var
    path         = require('path'),
    BC           = require('../index'),
    mainPageCtrl = require('./controller/mainPageRouteCtrl');

BC.initialize({
    componentsRoot: [
        {
            root: path.resolve(__dirname, './components'),
            prefix: ''
        }
    ],
    sourcesRoot:    path.resolve(__dirname, './sources')
}, () => {
    // After initialization, handle some route

    // req, res, next
    // mainPageCtrl({}, {}, () => {});
});

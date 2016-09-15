'use strict';

var
    path         = require('path'),
    BC           = require('../index'),
    mainPageCtrl = require('./controller/mainPageRouteCtrl');

const
    req = {
        headers: {
            accept: ''
        }
    },

    res = {
        send: () => res,
        json: () => res
    };

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
    mainPageCtrl(req, res, () => {});
});

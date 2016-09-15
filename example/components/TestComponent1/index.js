'use strict';

var
    BC            = require('../../../index'),
    ComponentText = require('../ComponentText');

class TestComponent1 extends BC.Component {
    // валидация опций

    // конструктор
    constructor(options, context) {
        super(options, context);

        // dep
        this.declareDependencies(
            {
                component: 'ComponentText',
                alias:     'Text',
                options:   {
                    color: 'red'
                }
            },
            {
                component: 'ComponentText',
                alias:     'AnotherTextBlock',
                options:   {
                    color: 'blue'
                }
            }
        );

        // sources
        this.declareSources({
            source:  'SomeSource',
            options: {
                id: '1'
            }
        });
    }
}

module.exports = TestComponent1;

var
    BC          = require('../../../index'),
    Component   = BC.Component,

    css         = require('./css.js'),

    SomeDepComp = require('SomeDepComp'),
    SomeSource2 = require('SomeSource2'),
    SomeSource  = require('SomeSource');

TestComponent1.optionsValidation = {
    'tic': 'tak'
};

TestComponent1.events = {
    [`click .${css.someAmazingClass}`]: 'handler'
};

TestComponent1.template = `
    <div class="${css.awesomeClass}">
        <div class="${css.alignCenter}">
            {{__dependencies.slider1}}
        </div>

        {{__dependencies.slider2}}
        {{__dependencies.slider3}}
    </div>
`;

class TestComponent1 extends Component {
    // валидация опций

    // конструктор
    constructor(options, context) {
        super(options, context);

        // static dep
        this.declareDependency(
            {
                component: SomeDepComp,
                alias:     'slider1',
                options:   {
                    id: options.id
                }
            },
            {
                component: SomeDepComp,
                alias:     'slider2',
                options:   {
                    name: options.name
                }
            }
        );

        this.declareSource(
            {
                source:  SomeSource,
                options: {
                    id: context.req.id
                }
            },
            {
                source:  SomeSource2,
                options: {
                    id: options.id
                }
            }
        );
    }

    onResponse(err, data) {
        // error handler
        // data handler

        // dynamic dep
        this.declareDependency(
            {
                component: SomeDepComp,
                alias:     'slider3',
                options:   {
                    id: data.id
                }
            }
        );

        return data;
    }

    handler(event) {
        // handler
    }
}

module.exports = TestComponent1;
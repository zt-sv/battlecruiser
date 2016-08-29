var
    BC                        = require('../../../index'),
    Component                 = BC.Component,

    ComponentText             = require('../ComponentText'),
    GetTextForSomethingSource = require('../../sources/SomeSource');

class TestComponent1 extends Component {
    // валидация опций

    // конструктор
    constructor(options, context) {
        super(options, context);

        // dep
        this.declareDependencies(
            {
                component: ComponentText,
                alias:     'Text',
                options:   {
                    color: 'red'
                }
            },
            {
                component: ComponentText,
                alias:     'AnotherTextBlock',
                options:   {
                    color: 'blue'
                }
            }
        );

        // sources
        this.declareSources({
            source:  GetTextForSomethingSource,
            options: {
                id: '1'
            }
        });
    }
}

module.exports = TestComponent1;

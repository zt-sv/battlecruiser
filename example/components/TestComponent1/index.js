var
    BC                        = require('../../../index'),
    Component                 = BC.Component,

    ComponentText             = require('../ComponentText'),
    GetTextForSomethingSource = require('../../sources/SomeSource'),

    actionExample             = require('./actions/actionExample');

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

    /**
     *
     * @param   {Event}   event
     */
    coolHandler(event) {
        this.callAction(

            // link to the action
            actionExample,

            // actions params
            {},

            // action complete callback
            (err, result) => {
                this.setState({
                    text: result.text
                });
            }
        );
    }

    /**
     * @param {Error}                   err
     * @param {GetTextForSomethingRes}  data
     */
    onResponse(err, data) {
        this.setState({
            text: data.text
        });
    }
}

module.exports = TestComponent1;

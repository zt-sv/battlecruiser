var
    BC        = require('../../../index'),
    PropChecker = BC.PropChecker,
    Component = BC.Component;

class TextComponent extends Component {
    // валидация опций

    // конструктор
    constructor(options, context) {
        super(options, context);
    }
}

TextComponent.optionsValidation = {
    color: [PropChecker.isRequired, PropChecker.isString]
};

module.exports = TextComponent;

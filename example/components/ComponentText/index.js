'use strict';

var
    BC          = require('../../../index'),
    PropChecker = BC.PropChecker;

class TextComponent extends BC.Component {
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

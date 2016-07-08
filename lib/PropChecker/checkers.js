/**
 * @module      lib/PropChecker/checkers
 *
 * @requires    lib/PropChecker/Checker
 * @requires    lib/PropChecker/helpers
 */
'use strict';

var
    Checker  = require('./Checker'),
    h        = require('./helpers'),
    checkers = {};

const
    except = ['isNull', 'isUndefined', 'notNullNotUndef'];

checkers.isRequired = new Checker((prop, value) => {
    if (h.isNull(value) || h.isUndefined(value)) {
        throw Error(`Property "${prop}" is required`);
    }
});

// Autogenerate simple validators
for (let method in h) {
    if (!h.hasOwnProperty(method) || ~except.indexOf(method)) {
        continue;
    }

    let
        type = method.replace('is', '').toLocaleLowerCase();

    checkers[method] = new Checker((prop, value) => {
        if (!(h.isNull(value) || h.isUndefined(value)) && !h[method](value)) {
            throw Error(`Property "${prop}" must be ${type}, but got ${value}`);
        }
    });
}

checkers.isArrayOf = typeChecker => {
    if (h.isNull(typeChecker) || h.isUndefined(typeChecker) || !(typeChecker instanceof Checker)) {
        throw Error(`Type checker for array elements must be type checker function, but got ${typeChecker}`);
    }

    return new Checker((prop, value) => {
        checkers.isArray.check(prop, value);

        value.forEach(el => {
            if (h.isNull(el) || h.isUndefined(el)) {
                throw Error(`Property "${prop}" have wrong element in array`);
            }

            try {
                typeChecker.check(prop, el);
            } catch (err) {
                throw Error(`Property "${prop}" have wrong element in array`);
            }
        });
    });
};

checkers.isEqual = equalValue => {
    if (h.isNull(equalValue) || h.isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return new Checker((prop, value) => {

    });
};

checkers.isDeepEqual = equalValue => {
    if (h.isNull(equalValue) || h.isUndefined(equalValue)) {
        throw Error('You should pass an any value');
    }

    return new Checker((prop, value) => {

    });
};

module.exports = checkers;

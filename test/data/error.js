var Util = require('util');

var CustomError = function () {
    Error.call(this);
    this.message = 'Custom error';
};

Util.inherits(CustomError, Error);

exports.NestedCustomError = function () {
    CustomError.call(this);
};

Util.inherits(exports.NestedCustomError, CustomError);

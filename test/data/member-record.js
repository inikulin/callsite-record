var obj = {};

obj['testFn'] = function () {
    module.exports = require('../../lib')('testFn');
};

obj.testFn();

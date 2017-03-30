var obj = {};

obj['testFn'] = function () {
    module.exports = require('../../lib')({ byFunctionName: 'testFn' });
};

obj.testFn();

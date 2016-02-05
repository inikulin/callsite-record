var assert        = require('assert');
var createFrames  = require('./create-frames');
var callsiteFrame = require('../');

it('Should create call source code frames', function () {
    console.log(createFrames(callsiteFrame.decorators.default, 5)[3]);

    assert.deepEqual(createFrames()[0], [
        '/* Multiline\n' +
        '     comment*/\n' +
        'var testClass = new TestClass();\n' +
        '                                \n' +
        'testClass.someFunc();\n' +
        'TestClass.staticFunc();\n'
    ]);
});

var assert        = require('assert');
var createFrames  = require('./create-frames');

it('Should create call site frames', function () {
    assert.deepEqual(createFrames(), [
        '    90 |    // ***************************************************\n' +
        '    91 |    // ***************************************************\n' +
        '    92 |\n' +
        '    93 |    /* Multiline\n' +
        '    94 |         comment*/\n' +
        ' >  95 |    var testClass = new TestClass();\n' +
        '    96 |\n' +
        '    97 |    testClass.someFunc();\n' +
        '    98 |    TestClass.staticFunc();\n' +
        '    99 |\n' +
        '   100 |    obj.func();',


        '    92 |\n' +
        '    93 |    /* Multiline\n' +
        '    94 |         comment*/\n' +
        '    95 |    var testClass = new TestClass();\n' +
        '    96 |\n' +
        ' >  97 |    testClass.someFunc();\n' +
        '    98 |    TestClass.staticFunc();\n' +
        '    99 |\n' +
        '   100 |    obj.func();\n' +
        '   101 |\n' +
        '   102 |    (function () {',


        '    93 |    /* Multiline\n' +
        '    94 |         comment*/\n' +
        '    95 |    var testClass = new TestClass();\n' +
        '    96 |\n' +
        '    97 |    testClass.someFunc();\n' +
        ' >  98 |    TestClass.staticFunc();\n' +
        '    99 |\n' +
        '   100 |    obj.func();\n' +
        '   101 |\n' +
        '   102 |    (function () {\n' +
        '   103 |        regularFunc2();',


        '    95 |    var testClass = new TestClass();\n' +
        '    96 |\n' +
        '    97 |    testClass.someFunc();\n' +
        '    98 |    TestClass.staticFunc();\n' +
        '    99 |\n' +
        ' > 100 |    obj.func();\n' +
        '   101 |\n' +
        '   102 |    (function () {\n' +
        '   103 |        regularFunc2();\n' +
        '   104 |    })();\n' +
        '   105 |',


        '    98 |    TestClass.staticFunc();\n' +
        '    99 |\n' +
        '   100 |    obj.func();\n' +
        '   101 |\n' +
        '   102 |    (function () {\n' +
        ' > 103 |        regularFunc2();\n' +
        '   104 |    })();\n' +
        '   105 |\n' +
        '   106 |    [1].forEach(regularFunc2);\n' +
        '   107 |\n' +
        '   108 |    return frames;',


        '   101 |\n' +
        '   102 |    (function () {\n' +
        '   103 |        regularFunc2();\n' +
        '   104 |    })();\n' +
        '   105 |\n' +
        ' > 106 |    [1].forEach(regularFunc2);\n' +
        '   107 |\n' +
        '   108 |    return frames;\n' +
        '   109 |};\n' +
        '   110 |\n' +
        '   111 |'
    ]);
});

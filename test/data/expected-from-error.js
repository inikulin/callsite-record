var join = require('path').join;

var file = join(__dirname, './from-error.js');

module.exports = [
    '    5 |function addRecord (err) {\n' +
    '    6 |    module.exports.push(createCallsiteRecord(err));\n' +
    '    7 |}\n' +
    '    8 |\n' +
    '    9 |function func1 () {\n' +
    ' > 10 |    throw new Error(\'Yo!\');\n' +
    '   11 |}\n' +
    '   12 |\n' +
    '   13 |(function func2 () {\n' +
    '   14 |    try {\n' +
    '   15 |        func1();\n' +
    '\n' +
    '   at func1 (' + file + ':10:11)\n' +
    '   at func2 (' + file + ':15:9)',


    '   26 |SomeClass.staticMethod = function () {\n' +
    '   27 |    throw new Error(\'Static method error\');\n' +
    '   28 |};\n' +
    '   29 |\n' +
    '   30 |try {\n' +
    ' > 31 |    throw new Error(\'Global error\');\n' +
    '   32 |}\n' +
    '   33 |catch (err) {\n' +
    '   34 |    addRecord(err);\n' +
    '   35 |}\n' +
    '   36 |\n' +
    '\n' +
    '   at Object.<anonymous> (' + file + ':31:11)\n' +
    '   at Module._compile (module.js:435:26)',


    '   18 |        addRecord(err);\n' +
    '   19 |    }\n' +
    '   20 |})();\n' +
    '   21 |\n' +
    '   22 |function SomeClass () {\n' +
    ' > 23 |    throw new Error(\'Class error\');\n' +
    '   24 |}\n' +
    '   25 |\n' +
    '   26 |SomeClass.staticMethod = function () {\n' +
    '   27 |    throw new Error(\'Static method error\');\n' +
    '   28 |};\n' +
    '\n' +
    '   at new SomeClass (' + file + ':23:11)\n' +
    '   at Object.<anonymous> (' + file + ':38:5)',


    '   22 |function SomeClass () {\n' +
    '   23 |    throw new Error(\'Class error\');\n' +
    '   24 |}\n' +
    '   25 |\n' +
    '   26 |SomeClass.staticMethod = function () {\n' +
    ' > 27 |    throw new Error(\'Static method error\');\n' +
    '   28 |};\n' +
    '   29 |\n' +
    '   30 |try {\n' +
    '   31 |    throw new Error(\'Global error\');\n' +
    '   32 |}\n' +
    '\n' +
    '   at Function.SomeClass.staticMethod (' + file + ':27:11)\n' +
    '   at Object.<anonymous> (' + file + ':45:15)'
];

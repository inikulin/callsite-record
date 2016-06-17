var join = require('path').join;

var file = join(__dirname, './from-error.js');

module.exports = [
    '    6 |function addRecord (err, topFrameFilter) {\n' +
    '    7 |    module.exports.push(createCallsiteRecord(err, topFrameFilter));\n' +
    '    8 |}\n' +
    '    9 |\n' +
    '   10 |function func1 () {\n' +
    ' > 11 |    throw new Error(\'Yo!\');\n' +
    '   12 |}\n' +
    '   13 |\n' +
    '   14 |(function func2 () {\n' +
    '   15 |    try {\n' +
    '   16 |        func1();\n' +
    '\n' +
    '   at func1 (' + file + ':11:11)\n' +
    '   at func2 (' + file + ':16:9)',


    '   27 |SomeClass.staticMethod = function () {\n' +
    '   28 |    throw new Error(\'Static method error\');\n' +
    '   29 |};\n' +
    '   30 |\n' +
    '   31 |try {\n' +
    ' > 32 |    throw new Error(\'Global error\');\n' +
    '   33 |}\n' +
    '   34 |catch (err) {\n' +
    '   35 |    addRecord(err);\n' +
    '   36 |}\n' +
    '   37 |\n' +
    '\n' +
    '   at Object.<anonymous> (' + file + ':32:11)',


    '   19 |        addRecord(err);\n' +
    '   20 |    }\n' +
    '   21 |})();\n' +
    '   22 |\n' +
    '   23 |function SomeClass () {\n' +
    ' > 24 |    throw new Error(\'Class error\');\n' +
    '   25 |}\n' +
    '   26 |\n' +
    '   27 |SomeClass.staticMethod = function () {\n' +
    '   28 |    throw new Error(\'Static method error\');\n' +
    '   29 |};\n' +
    '\n' +
    '   at new SomeClass (' + file + ':24:11)\n' +
    '   at Object.<anonymous> (' + file + ':39:5)',


    '   23 |function SomeClass () {\n' +
    '   24 |    throw new Error(\'Class error\');\n' +
    '   25 |}\n' +
    '   26 |\n' +
    '   27 |SomeClass.staticMethod = function () {\n' +
    ' > 28 |    throw new Error(\'Static method error\');\n' +
    '   29 |};\n' +
    '   30 |\n' +
    '   31 |try {\n' +
    '   32 |    throw new Error(\'Global error\');\n' +
    '   33 |}\n' +
    '\n' +
    '   at Function.SomeClass.staticMethod (' + file + ':28:11)\n' +
    '   at Object.<anonymous> (' + file + ':46:15)',


    '   54 |\n' +
    '   55 |    return !/throw-error\\.js/.test(filename);\n' +
    '   56 |}\n' +
    '   57 |\n' +
    '   58 |try {\n' +
    ' > 59 |    throwError();\n' +
    '   60 |}\n' +
    '   61 |catch (err) {\n' +
    '   62 |    addRecord(err, topFrameFilter);\n' +
    '   63 |}\n' +
    '   64 |\n' +
    '\n' +
    '   at Object.<anonymous> (' + file + ':59:5)'
];

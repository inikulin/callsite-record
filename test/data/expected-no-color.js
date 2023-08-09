var join = require('path').join;

var getRecordsFile = join(__dirname, './get-records.js');
var recordsFile    = join(__dirname, './records.js');

module.exports = [
    '    90 |    // ***************************************************\n' +
    '    91 |    // ***************************************************\n' +
    '    92 |\n' +
    '    93 |    /* Multiline\n' +
    '    94 |         comment*/\n' +
    ' >  95 |    var testClass = new TestClass();\n' +
    '    96 |\n' + '    97 |    testClass.someFunc();\n' +
    '    98 |    TestClass.staticFunc();\n' +
    '    99 |\n' +
    '   100 |    obj.func();\n' +
    '\n' +
    '   at getRecords (' + getRecordsFile + ':95:21)\n' +
    '   at Object.<anonymous> (' + recordsFile + ':13:15)',


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
    '   102 |    (function () {\n' +
    '\n' +
    '   at getRecords (' + getRecordsFile + ':97:15)\n' +
    '   at Object.<anonymous> (' + recordsFile + ':13:15)',


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
    '   103 |        regularFunc2();\n' +
    '\n' +
    '   at getRecords (' + getRecordsFile + ':98:15)\n' +
    '   at Object.<anonymous> (' + recordsFile + ':13:15)',


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
    '   105 |\n' +
    '\n' +
    '   at getRecords (' + getRecordsFile + ':100:9)\n' +
    '   at Object.<anonymous> (' + recordsFile + ':13:15)',

    '    98 |    TestClass.staticFunc();\n' +
    '    99 |\n' +
    '   100 |    obj.func();\n' +
    '   101 |\n' +
    '   102 |    (function () {\n' +
    ' > 103 |        regularFunc2();\n' +
    '   104 |    })();\n' +
    '   105 |\n' +
    '   106 |    [\'&test&\'].forEach(regularFunc2);\n' +
    '   107 |\n' +
    '   108 |    return records;\n' +
    '\n' +
    '   at <anonymous> (' + getRecordsFile + ':103:9)\n' +
    '   at getRecords (' + getRecordsFile + ':104:7)',

    '   101 |\n' +
    '   102 |    (function () {\n' +
    '   103 |        regularFunc2();\n' +
    '   104 |    })();\n' +
    '   105 |\n' +
    ' > 106 |    [\'&test&\'].forEach(regularFunc2);\n' +
    '   107 |\n' +
    '   108 |    return records;\n' +
    '   109 |};\n' +
    '   110 |\n' +
    '\n' +
    '   at getRecords (' + getRecordsFile + ':106:16)\n' +
    '   at Object.<anonymous> (' + recordsFile + ':13:15)',
];

var join = require('path').join;

var getRecordsFile = join(__dirname, './get-records.js');
var testFile       = join(__dirname, '../test.js');

module.exports = [
    '    90 |    \u001b[90m\u001b[1m// ***************************************************\u001b[22m\u001b[39m\n' +
    '    91 |    \u001b[90m\u001b[1m// ***************************************************\u001b[22m\u001b[39m\n' +
    '    92 |\n' + '    93 |    \u001b[90m\u001b[1m/* Multiline\u001b[22m\u001b[39m\n' +
    '    94 |\u001b[90m\u001b[1m         comment*/\u001b[22m\u001b[39m\n' +
    '\u001b[41m >  95 \u001b[49m|    \u001b[36mvar\u001b[39m testClass \u001b[90m=\u001b[39m \u001b[36mnew\u001b[39m TestClass\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    96 |\n' +
    '    97 |    testClass\u001b[90m.\u001b[39msomeFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    98 |    TestClass\u001b[90m.\u001b[39mstaticFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    99 |\n' +
    '   100 |    obj\u001b[90m.\u001b[39mfunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':95:21\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mObject.<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + testFile + ':12:15\u001b[24m\u001b[39m)',


    '    92 |\n' + '    93 |    \u001b[90m\u001b[1m/* Multiline\u001b[22m\u001b[39m\n' +
    '    94 |\u001b[90m\u001b[1m         comment*/\u001b[22m\u001b[39m\n' +
    '    95 |    \u001b[36mvar\u001b[39m testClass \u001b[90m=\u001b[39m \u001b[36mnew\u001b[39m TestClass\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    96 |\n' +
    '\u001b[41m >  97 \u001b[49m|    testClass\u001b[90m.\u001b[39msomeFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    98 |    TestClass\u001b[90m.\u001b[39mstaticFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    99 |\n' +
    '   100 |    obj\u001b[90m.\u001b[39mfunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   101 |\n' +
    '   102 |    \u001b[90m(\u001b[39m\u001b[36mfunction\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[90m{\u001b[39m\n' +
    '\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':97:15\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mObject.<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + testFile + ':12:15\u001b[24m\u001b[39m)',


    '    93 |    \u001b[90m\u001b[1m/* Multiline\u001b[22m\u001b[39m\n' +
    '    94 |\u001b[90m\u001b[1m         comment*/\u001b[22m\u001b[39m\n' +
    '    95 |    \u001b[36mvar\u001b[39m testClass \u001b[90m=\u001b[39m \u001b[36mnew\u001b[39m TestClass\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    96 |\n' +
    '    97 |    testClass\u001b[90m.\u001b[39msomeFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '\u001b[41m >  98 \u001b[49m|    TestClass\u001b[90m.\u001b[39mstaticFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    99 |\n' +
    '   100 |    obj\u001b[90m.\u001b[39mfunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   101 |\n' +
    '   102 |    \u001b[90m(\u001b[39m\u001b[36mfunction\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[90m{\u001b[39m\n' +
    '   103 |        regularFunc2\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':98:15\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mObject.<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + testFile + ':12:15\u001b[24m\u001b[39m)',


    '    95 |    \u001b[36mvar\u001b[39m testClass \u001b[90m=\u001b[39m \u001b[36mnew\u001b[39m TestClass\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    96 |\n' +
    '    97 |    testClass\u001b[90m.\u001b[39msomeFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    98 |    TestClass\u001b[90m.\u001b[39mstaticFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    99 |\n' +
    '\u001b[41m > 100 \u001b[49m|    obj\u001b[90m.\u001b[39mfunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   101 |\n' +
    '   102 |    \u001b[90m(\u001b[39m\u001b[36mfunction\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[90m{\u001b[39m\n' +
    '   103 |        regularFunc2\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   104 |    \u001b[90m}\u001b[39m\u001b[90m)\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   105 |\n' +
    '\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':100:9\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mObject.<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + testFile + ':12:15\u001b[24m\u001b[39m)',


    '    98 |    TestClass\u001b[90m.\u001b[39mstaticFunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '    99 |\n' +
    '   100 |    obj\u001b[90m.\u001b[39mfunc\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   101 |\n' +
    '   102 |    \u001b[90m(\u001b[39m\u001b[36mfunction\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[90m{\u001b[39m\n' +
    '\u001b[41m > 103 \u001b[49m|        regularFunc2\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   104 |    \u001b[90m}\u001b[39m\u001b[90m)\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   105 |\n' +
    '   106 |    \u001b[90m[\u001b[39m\u001b[32m\'&test&\'\u001b[39m\u001b[90m]\u001b[39m\u001b[90m.\u001b[39mforEach\u001b[90m(\u001b[39mregularFunc2\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   107 |\n' + '   108 |    \u001b[36mreturn\u001b[39m records\u001b[90m;\u001b[39m\n' +
    '\n' +
    '   at \u001b[1m<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':103:9\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':104:7\u001b[24m\u001b[39m)',


    '   101 |\n' +
    '   102 |    \u001b[90m(\u001b[39m\u001b[36mfunction\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[90m{\u001b[39m\n' +
    '   103 |        regularFunc2\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   104 |    \u001b[90m}\u001b[39m\u001b[90m)\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   105 |\n' +
    '\u001b[41m > 106 \u001b[49m|    \u001b[90m[\u001b[39m\u001b[32m\'&test&\'\u001b[39m\u001b[90m]\u001b[39m\u001b[90m.\u001b[39mforEach\u001b[90m(\u001b[39mregularFunc2\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   107 |\n' + '   108 |    \u001b[36mreturn\u001b[39m records\u001b[90m;\u001b[39m\n' +
    '   109 |\u001b[90m}\u001b[39m\u001b[90m;\u001b[39m\n' +
    '   110 |\n' +
    '\n' +
    '   at \u001b[1mgetRecords\u001b[22m (\u001b[90m\u001b[4m' + getRecordsFile + ':106:16\u001b[24m\u001b[39m)\n' +
    '   at \u001b[1mObject.<anonymous>\u001b[22m (\u001b[90m\u001b[4m' + testFile + ':12:15\u001b[24m\u001b[39m)'
];

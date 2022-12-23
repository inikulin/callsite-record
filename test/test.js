// NOTE: enable color output for chalk before any dependency is loaded
process.env.FORCE_COLOR = true;

var assert                  = require('assert');
var sep                     = require('path').sep;
var Promise                 = require('pinkie-promise');
var createCallsiteRecord    = require('..');
var renderers               = require('..').renderers;
var records                 = require('./data/records');
var smallFrameRecord        = require('./data/small-frame');
var memberRecord            = require('./data/member-record');
var wrappedMemberRecord     = require('./data/wrapped-member-record');
var recordsFromError        = require('./data/from-error');
var wrappedRecordsFromError = require('./data/wrapped-from-error');
var expectedDefault         = require('./data/expected-default');
var expectedNoColor         = require('./data/expected-no-color');
var expectedHtml            = require('./data/expected-html');
var expectedFromError       = require('./data/expected-from-error');

function renderRecords (sync, opts) {
    var rendered = records.map(function (record) {
        var render = sync ? record.renderSync : record.render;

        return render.call(record, opts);
    });

    return sync ? rendered : Promise.all(rendered);
}

function stackFilter (frame, idx) {
    // NOTE: keep only frames that relates to the project files
    var fileName = frame.getFileName();

    return idx < 2 && fileName.indexOf(sep) >= 0 && !fileName.startsWith('internal');
}

it('Should create and render callsite records with "default" renderer', function () {
    var opts = { stackFilter: stackFilter };

    assert.deepEqual(renderRecords(true, opts), expectedDefault);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedDefault);
        });
});

it('Should create and render callsite records with "noColor" renderer', function () {
    var opts = {
        renderer:    renderers.noColor,
        stackFilter: stackFilter
    };

    assert.deepEqual(renderRecords(true, opts), expectedNoColor);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});

it('Should create and render callsite records with "html" renderer', function () {
    var opts = {
        renderer:    renderers.html,
        stackFilter: stackFilter
    };

    assert.deepEqual(renderRecords(true, opts), expectedHtml);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedHtml);
        });
});

it('Should create and render callsite records from error', function () {
    var rendered = recordsFromError.map(function (record) {
        return record.renderSync({
            renderer:    renderers.noColor,
            stackFilter: stackFilter
        });
    });

    assert.deepEqual(rendered, expectedFromError);
});

it('Should provide option that changes code frame size', function () {
    var expected = ' > 95 |    var testClass = new TestClass();';

    var opts = {
        renderer:  renderers.noColor,
        frameSize: 0,
        stack:     false
    };

    assert.strictEqual(records[0].renderSync(opts), expected);

    expected = '   93 |    /* Multiline\n' +
               '   94 |         comment*/\n' +
               ' > 95 |    var testClass = new TestClass();\n' +
               '   96 |\n' +
               '   97 |    testClass.someFunc();';

    opts.frameSize = 2;

    assert.strictEqual(records[0].renderSync(opts), expected);
});

it('Should gracefully handle frames with the excessive size', function () {
    var expected = '   1 |(function testFn () {\n' +
                   '   2 |    module.exports = require(\'../../lib\')({ byFunctionName: \'testFn\' });\n' +
                   ' > 3 |})();\n' +
                   '   4 |';

    var opts = {
        renderer:  renderers.noColor,
        frameSize: 10,
        stack:     false
    };

    assert.strictEqual(smallFrameRecord.renderSync(opts), expected);
});


it('Should return `null` if callsite does not exists', function () {
    assert.strictEqual(createCallsiteRecord({ byFunctionName: 'yoTest123' }), null);
});

it('Should produce callsite for assigned member function', function () {
    var expected = '   2 |\n' +
                   '   3 |obj[\'testFn\'] = function () {\n' +
                   '   4 |    module.exports = require(\'../../lib\')({ byFunctionName: \'testFn\' });\n' +
                   '   5 |};\n' +
                   '   6 |\n' +
                   ' > 7 |obj.testFn();\n' +
                   '   8 |';

    var opts = {
        renderer: renderers.noColor,
        stack:    false
    };

    assert.strictEqual(memberRecord.renderSync(opts), expected);
});

it("Should not render code frame if it's disabled", function () {
    var expected = '\n\n   at Object.<anonymous> (testfile.js:7:5)';

    var opts = {
        renderer:    renderers.noColor,
        stackFilter: stackFilter,
        codeFrame:   false
    };

    var actual = memberRecord.renderSync(opts);

    actual = actual.replace(require.resolve('./data/member-record'), 'testfile.js');

    assert.strictEqual(actual, expected);
});

it('Should produce wrapped callsite by function name if "options.processFrameFn" is assigned', function () {
    var expected = '   14 |    });\n' +
                   '   15 |};\n' +
                   '   16 |\n' +
                   '   17 |obj.testFn();\n' +
                   '   18 |\n' +
                   ' > 19 |// Yo!\n' +
                   '   20 |';

    var opts = {
        renderer: renderers.noColor,
        stack:    false
    };

    assert.strictEqual(wrappedMemberRecord.renderSync(opts), expected);
});

it('Should produce wrapped callsite for error if "options.processFrameFn" is assigned', function () {
    var expected = '   27 |            return frame;\n' +
                   '   28 |        });\n' +
                   '   29 |    }\n' +
                   '   30 |})();\n' +
                   '   31 |\n' +
                   ' > 32 |// Yo!\n' +
                   '   33 |';

    var opts = {
        renderer: renderers.noColor,
        stack:    false
    };

    assert.strictEqual(wrappedRecordsFromError.renderSync(opts), expected);
});

describe('Regression', function () {
    it('Should return `null` if error stack can not be parsed (GH-5)', function () {
        var error = new Error('Hey!');

        error.stack = null;

        assert.strictEqual(createCallsiteRecord({ forError: error }), null);

        error.stack = '42';

        assert.strictEqual(createCallsiteRecord({ forError: error }), null);
    });
});

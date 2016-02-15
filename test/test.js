// NOTE: enable chalk before any dependency is loaded
require('chalk').enabled = true;

var assert               = require('assert');
var Promise              = require('pinkie-promise');
var createCallsiteRecord = require('..');
var getRecords           = require('./data/get-records');
var smallFrameRecord     = require('./data/small-frame');
var expectedDefault      = require('./data/expected-default');
var expectedNoColor      = require('./data/expected-no-color');
var expectedHtml         = require('./data/expected-html');

var records = getRecords();

var renderers = createCallsiteRecord.renderers;

function renderRecords (sync, opts) {
    var rendered = records.map(function (record) {
        var render = sync ? record.renderSync : record.render;

        return render.call(record, opts);
    });

    return sync ? rendered : Promise.all(rendered);
}

function stackFilter (frame, idx) {
    // NOTE: keep only frames that relates to the project files
    return idx < 2;
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
                   '   2 |    module.exports = require(\'../../lib\')(\'testFn\');\n' +
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
    assert.strictEqual(createCallsiteRecord('yoTest123'), null);
});

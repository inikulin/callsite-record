// NOTE: enable chalk before any dependency is loaded
require('chalk').enabled = true;

var assert          = require('assert');
var Promise         = require('pinkie-promise');
var renderers       = require('..').renderers;
var getRecords      = require('./data/get-records');
var expectedDefault = require('./data/expected-default');
var expectedNoColor = require('./data/expected-no-color');
var expectedHtml    = require('./data/expected-html');

var records = getRecords();

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


// NOTE: enable chalk before any dependency is loaded
require('chalk').enabled = true;

var assert          = require('assert');
var Promise         = require('pinkie-promise');
var CallsiteRecord  = require('..');
var getRecords      = require('./data/get-records');
var expectedDefault = require('./data/expected-default');
var expectedNoColor = require('./data/expected-no-color');
var expectedHtml    = require('./data/expected-html');

var records   = getRecords();
var renderers = CallsiteRecord.renderers;

function renderRecords (sync, opts) {
    var rendered = records.map(function (record) {
        var render = sync ? CallsiteRecord.prototype.renderSync : CallsiteRecord.prototype.render;

        return render.call(record, opts);
    });

    return sync ? rendered : Promise.all(rendered);
}

it('Should create and render callsite records with "default" renderer', function () {
    var opts = { stack: false };

    assert.deepEqual(renderRecords(true, opts), expectedDefault);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedDefault);
        });
});

it('Should create and render callsite records with "noColor" renderer', function () {
    var opts = {
        renderer: renderers.noColor,
        stack:    false
    };

    assert.deepEqual(renderRecords(true, opts), expectedNoColor);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});

it('Should create and render callsite records with "html" renderer', function () {
    var opts = {
        renderer: renderers.html,
        stack:    false
    };

    assert.deepEqual(renderRecords(true, opts), expectedHtml);

    return renderRecords(false, opts)
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedHtml);
        });
});


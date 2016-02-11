// NOTE: enable chalk before any dependency is loaded
require('chalk').enabled = true;

var assert          = require('assert');
var Promise         = require('pinkie-promise');
var renderers       = require('..').renderers;
var createFrames    = require('./data/create-frames');
var expectedDefault = require('./data/expected-default');
var expectedNoColor = require('./data/expected-no-color');

it('Should create and render callsite records with "default" renderer', function () {
    assert.deepEqual(createFrames(true), expectedDefault);

    return Promise.all(createFrames(false))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedDefault);
        });
});

it('Should create and render callsite records with "noColor" renderer', function () {
    assert.deepEqual(createFrames(true, renderers.noColor), expectedNoColor);

    return Promise.all(createFrames(false, renderers.noColor))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});

it('Should create and render callsite records with "html" renderer', function () {
    assert.deepEqual(createFrames(true, renderers.html), expectedNoColor);

    return Promise.all(createFrames(false, renderers.html))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});


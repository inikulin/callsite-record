// NOTE: enable chalk before any dependency is loaded
require('chalk').enabled = true;

var assert             = require('assert');
var Promise            = require('pinkie-promise');
var renderers          = require('..').renderers;
var createFrames       = require('./data/create-frames');
var expectedDefaultWin = require('./data/expected-default-win');
var expectedNoColor    = require('./data/expected-no-color');

it('Should create and render callsite records with "default" renderer', function () {
    assert.deepEqual(createFrames(true), expectedDefaultWin);

    return Promise.all(createFrames(false))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedDefaultWin);
        });
});

it('Should create and render callsite records with "noColor" renderer', function () {
    assert.deepEqual(createFrames(true, renderers.noColor), expectedNoColor);

    return Promise.all(createFrames(false, renderers.noColor))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});


var assert          = require('assert');
var Promise         = require('pinkie-promise');
var renderers       = require('..').renderers;
var createFrames    = require('./data/create-frames');
var expectedNoColor = require('./data/expected-no-color');


it('Should create and render callsite records with "default" renderer', function () {
    createFrames(true).forEach(function (frame) {
        console.log(frame);
        console.log();
        console.log();
    });
});

it('Should create and render callsite records with "noColor" renderer', function () {
    assert.deepEqual(createFrames(true, renderers.noColor), expectedNoColor);

    return Promise.all(createFrames(false, renderers.noColor))
        .then(function (rendered) {
            assert.deepEqual(rendered, expectedNoColor);
        });
});


var assert       = require('assert');
var createFrames = require('./create-frames');

it('Should create call source code frames', function () {
    assert.deepEqual(createFrames(), [

    ]);
});

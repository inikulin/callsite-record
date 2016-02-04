'use strict';

var callFrame = require('../');

module.exports = function createFrames (decorator, frameSize) {
    var frames = [];

    function createFrameForFn (fnName) {
        frames.push(callFrame.forFn(fnName, decorator, frameSize))
    }

    function createFrameForMemberFn (typeName, fnName) {
        frames.push(callFrame.forMemberFn(typeName, fnName, decorator, frameSize))
    }


    // -------------
    function TestClass () {
        createFrameForMemberFn('TestClass', 'constructor');
    }

    TestClass.prototype.someFunc = function () {
        createFrameForMemberFn('TestClass', 'someFunc');
        createFrameForFn('someFunc');
    };

    TestClass.staticFunc = function () {
        createFrameForMemberFn('Function', 'staticFunc');
        createFrameForFn('staticFunc');
    };

    var obj = {
        func: function () {
            createFrameForMemberFn('Object', 'func');
            createFrameForFn('func');
        }
    };

    function regularFunc1 () {
        createFrameForFn('regularFunc2');
    }

    function regularFunc2 () {
        regularFunc1();
    }

    // -------------

    var testClass = new TestClass();

    testClass.someFunc();
    TestClass.staticFunc();

    obj.func();

    regularFunc2();


    return frames;
};


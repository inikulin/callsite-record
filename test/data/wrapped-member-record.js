var obj = {};

obj['testFn'] = function () {
    module.exports = require('../../lib')({
        byFunctionName: 'testFn', processFrameFn: function (frame) {
            Object.defineProperty(frame, 'getLineNumber', { configurable: true, writable: true });

            frame.getLineNumber = function () {
                return 19;
            };

            return frame;
        },
    });
};

obj.testFn();

// Yo!

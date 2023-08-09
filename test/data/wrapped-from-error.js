var createCallsiteRecord = require('../../lib');

function addRecord (err, isCallsiteFrame, processFrameFn) {
    module.exports = createCallsiteRecord({
        forError:        err,
        isCallsiteFrame: isCallsiteFrame,
        processFrameFn:  processFrameFn,
    });
}

function func1 () {
    throw new Error('Yo!');
}

(function func2 () {
    try {
        func1();
    }
    catch (err) {
        addRecord(err, false, function (frame) {
            Object.defineProperty(frame, 'getLineNumber', { configurable: true, writable: true });

            frame.getLineNumber = function () {
                return 32;
            };

            return frame;
        });
    }
})();

// Yo!

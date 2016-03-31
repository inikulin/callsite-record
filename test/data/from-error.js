var createCallsiteRecord = require('../../lib');

module.exports = [];

function addRecord (err) {
    module.exports.push(createCallsiteRecord(err));
}

function func1 () {
    throw new Error('Yo!');
}

(function func2 () {
    try {
        func1();
    }
    catch (err) {
        addRecord(err);
    }
})();

function SomeClass () {
    throw new Error('Class error');
}

SomeClass.staticMethod = function () {
    throw new Error('Static method error');
};

try {
    throw new Error('Global error');
}
catch (err) {
    addRecord(err);
}

try {
    new SomeClass();
}
catch (err) {
    addRecord(err);
}

try {
    SomeClass.staticMethod();
}
catch (err) {
    addRecord(err);
}

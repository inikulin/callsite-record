'use strict';

const createCallsiteRecord = require('callsite-record');

let record = null;

function func1 () {
    func2();
}

function func2 () {
    (function func3 () {
        func4();
    })();
}

function func4 () {
    record = createCallsiteRecord('func2');
}

func1();

console.log(record.renderSync());

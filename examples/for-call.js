'use strict';

const createCallsiteRecord = require('callsite-record');

function func2 () {
    (function func1 () {
        console.log(createCallsiteRecord('func2').renderSync());
    })();
}

func2();

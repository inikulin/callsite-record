'use strict';

const createCallsiteRecord = require('callsite-record');

function myFunc() {
    throw new Error('Yo!');
}

try {
    myFunc();
}
catch(err) {
    console.log(createCallsiteRecord(err).renderSync());
}

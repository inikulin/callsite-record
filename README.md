# callsite-record
[![Build Status](https://api.travis-ci.org/inikulin/callsite-record.svg)](https://travis-ci.org/inikulin/callsite-record)

*Create fancy call site records for any function up in the stack for the logging purposes.*

```js
'use strict';

const createCallsiteRecord = require('callsite-record');

let record = null;

function func1 () {
    record = createCallsiteRecord('func1');
}

(function func2(){
    func1();
})();

console.log(record.renderSync());
```

 ⬇

![example](https://raw.githubusercontent.com/inikulin/callsite-record/master/media/example.png)

## Install
```
npm install callsite-record
```

## Author
[Ivan Nikulin](https://github.com/inikulin) (ifaaan@gmail.com)

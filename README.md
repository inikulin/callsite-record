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

## API

### createCallsiteRecord(functionName, [typeName]) → CallsiteRecord

Creates `CallsiteRecord` for the function up in the call stack specified by `functionName`. You can optionally specify a
`typeName` if the function is a method. If the function is a constructor set `functionName` to `constructor`.

*Example:*
```js
const createCallsiteRecord = require('callsite-record');

(function func1() {
    (function func2() {
        (function func3() {
            const record = createCallsiteRecord('func2');
        })();
    })();
})();
```

### CallsiteRecord
#### CallsiteRecord.render([renderOptions]) → String
Renders call site record to the string.

*Example:*
```js
console.log(record.render());
```

##### renderOptions.frameSize
Specifies the number of lines rendered above and below the call site in the code frame. **Default:** `5`.

*Example:*
```js
console.log(record.render({ frameSize: 0 }));
// > 12 |    func1();
// ...

console.log(record.render({ frameSize: 1 }));
//   11 |(function func2() {
// > 12 |    func1();
//   13 |})();
// ...
```

#### renderOptions.stack
Specifies if stack trace should be rendered in addition to the code frame. **Default:** `true`.

#### renderOptions.stackFilter
Function that will be used to filter stack frames. Function accepts 2 arguments:
 - `stackFrame` - V8 [CallSite](https://github.com/v8/v8/wiki/Stack-Trace-API#customizing-stack-traces) object.
 - `idx` - index of the frame.

**Default:** `null`.

*Example:*
```js
const sep = require('path').sep;

// Remove node core lib calls from the stack trace
record.render({ stackFilter: frame => frame.getFileName().indexOf(sep) > -1 });
```

#### renderOptions.renderer
Specifies the output format of the rendering. **Default:** `renderers.default`. You can pass your own
renderer object ([example implementations](https://github.com/inikulin/callsite-record/tree/master/lib/renderers)) or use
one of the built-in renderers:

##### renderers.default
Provides ANSI-colored output as shown above.

*Usage:*
```js
const defaultRenderer = require('callsite-record').renderers.default;

record.render({ renderer: defaultRenderer });
```

##### renderers.noColor
Same as `default` renderer but without colors.

*Usage:*
```js
const noColorRenderer = require('callsite-record').renderers.noColor;

record.render({ renderer: noColorRenderer });
```

##### renderers.html
Outputs HTML that can be later decorated with the CSS and embeded into the web page. [Example output](https://github.com/inikulin/callsite-record/blob/master/test/data/expected-html/0.html).

*Usage:*
```js
const htmlRenderer = require('callsite-record').renderers.html;

record.render({ renderer: html });
```

## Related
 * [is-es2016-keyword](https://github.com/inikulin/is-es2016-keyword) - Determine if string is an ES2016 keyword.
 * [highlight-es](https://github.com/inikulin/highlight-es) - Highlight ECMAScript syntax for the console or any other medium.

## Author
[Ivan Nikulin](https://github.com/inikulin) (ifaaan@gmail.com)

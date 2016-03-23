var fs        = require('fs');
var Promise   = require('pinkie-promise');
var callsite  = require('callsite');
var padStart  = require('lodash/string').padStart;
var defatuls  = require('defaults');
var highlight = require('highlight-es');

var renderers = {
    default: require('./renderers/default'),
    noColor: require('./renderers/no-color'),
    html:    require('./renderers/html')
};


var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

// Utils
function findClosestNonNativeAncestorFrameIdx (stackFrames, curIdx) {
    for (var i = curIdx + 1; i < stackFrames.length; i++) {
        if (!stackFrames[i].isNative())
            return i;
    }

    return null;
}


// NOTE: The following code was partially adopted from the V8 code
// (see: https://github.com/v8/v8/blob/3c3d7e7be80f45eeea0dc74a71d7552e2afc2985/src/js/messages.js#L647)
function getFrameLocation (frame) {
    if (frame.isNative())
        return 'native';

    var location = frame.getFileName();
    var lineNum  = frame.getLineNumber();
    var colNum   = frame.getColumnNumber();

    if (!location) {
        location = frame.isEval() ? frame.getEvalOrigin() + ', ' : '';
        location += '<anonymous>';
    }

    if (lineNum) {
        location += ':' + lineNum;

        if (colNum)
            location += ':' + colNum;
    }

    return location;
}

function getFrameMethodName (frame, funcName) {
    var typeName   = frame.getTypeName();
    var methodName = frame.getMethodName();

    if (funcName) {
        var name                       = '';
        var funcNameStartsWithTypeName = typeName && funcName.indexOf(typeName) === 0;
        var funcNameEndsWithMethodName = methodName &&
                                         funcName.indexOf('.' + methodName) === funcName.length - methodName - 1;

        if (!funcNameStartsWithTypeName)
            name = typeName + '.';

        name += funcName;

        if (!funcNameEndsWithMethodName)
            name += ' [as ' + methodName + ']';

        return name;
    }

    return typeName + '.' + (methodName || '<anonymous>');
}

function getFrameName (frame) {
    var funcName = frame.getFunctionName();
    var isCtor   = frame.isConstructor();
    var isMethod = !frame.isToplevel() && !isCtor;

    if (isMethod)
        return getFrameMethodName(frame, funcName);

    funcName = funcName || '<anonymous>';

    return isCtor ? 'new ' + funcName : funcName;
}

// CallsiteRecord
var CallsiteRecord = function (filename, lineNum, callsiteFrameIdx, stackFrames) {
    this.filename         = filename;
    this.lineNum          = lineNum;
    this.callsiteFrameIdx = callsiteFrameIdx;
    this.stackFrames      = stackFrames;
};

CallsiteRecord.prototype._getCodeFrameLines = function (fileContent, frameSize) {
    var lines            = fileContent.split(NEWLINE);
    var startLineIdx     = Math.max(0, this.lineNum - frameSize);
    var endLineIdx       = Math.min(lines.length - 1, this.lineNum + frameSize);
    var maxLineNumDigits = 0;
    var frameLines       = [];

    for (var i = startLineIdx; i <= endLineIdx; i++) {
        var num = String(i + 1);

        maxLineNumDigits = Math.max(maxLineNumDigits, num.length);

        frameLines.push({
            num:  num,
            src:  lines[i],
            base: i === this.lineNum
        });
    }

    frameLines.forEach(function (line) {
        line.num = padStart(line.num, maxLineNumDigits);
    });

    return frameLines;
};

CallsiteRecord.prototype._renderCodeFrame = function (fileContent, renderer, frameSize) {
    if (renderer.syntax)
        fileContent = highlight(fileContent, renderer.syntax);

    var lines   = this._getCodeFrameLines(fileContent, frameSize);
    var lastIdx = lines.length - 1;

    var frame = lines
        .reduce(function (sourceFrame, line, idx) {
            var isLast = idx === lastIdx;

            return sourceFrame + renderer.codeLine(line.num, line.base, line.src, isLast);
        }, '');

    return renderer.codeFrame(frame);
};


CallsiteRecord.prototype._renderStack = function (renderer, stackFilter) {
    var entries = this.stackFrames.slice(this.callsiteFrameIdx);

    if (stackFilter)
        entries = entries.filter(stackFilter);

    var lastIdx = entries.length - 1;

    var rendered = entries.reduce(function (str, frame, idx) {
        var isLast   = idx === lastIdx;
        var name     = getFrameName(frame);
        var location = getFrameLocation(frame);

        return str + renderer.stackLine(name, location, isLast);
    }, '');

    return rendered ? renderer.stack(rendered) : '';
};

CallsiteRecord.prototype._renderRecord = function (fileContent, opts) {
    opts = defatuls(opts, {
        renderer:    renderers.default,
        frameSize:   5,
        stack:       true,
        stackFilter: null
    });

    var codeFrame = this._renderCodeFrame(fileContent, opts.renderer, opts.frameSize);
    var stack     = opts.stack ? this._renderStack(opts.renderer, opts.stackFilter) : '';

    return codeFrame + stack;
};

CallsiteRecord.prototype.renderSync = function (opts) {
    var fileContent = fs.readFileSync(this.filename).toString();

    return this._renderRecord(fileContent, opts);
};

CallsiteRecord.prototype.render = function (opts) {
    var record = this;

    return new Promise(function (resolve, reject) {
        fs.readFile(record.filename, function (err, fileContent) {
            if (err)
                reject(err);
            else
                resolve(record._renderRecord(fileContent.toString(), opts));
        });
    });
};

// API
module.exports = function createCallsiteRecord (fnName, typeName) {
    var stackFrames = callsite();

    // NOTE: remove API call
    stackFrames.shift();

    if (typeName && fnName === 'constructor')
        fnName = typeName;

    for (var i = 0; i < stackFrames.length; i++) {
        var frame        = stackFrames[i];
        var isMemberCall = typeName && frame.getMethodName() === fnName && frame.getTypeName() === typeName;

        if (isMemberCall || frame.getFunctionName() === fnName) {
            var callsiteFrameIdx = findClosestNonNativeAncestorFrameIdx(stackFrames, i);

            if (callsiteFrameIdx !== null) {
                var callsiteFrame = stackFrames[callsiteFrameIdx];
                var filename      = callsiteFrame.getFileName();
                var lineNum       = callsiteFrame.getLineNumber() - 1;

                return new CallsiteRecord(filename, lineNum, callsiteFrameIdx, stackFrames);
            }

            return null;
        }
    }

    return null;
};

module.exports.renderers = renderers;

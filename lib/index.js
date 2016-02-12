var fs              = require('fs');
var Promise         = require('pinkie-promise');
var callsite        = require('callsite');
var jsTokensRe      = require('js-tokens');
var leftPad         = require('left-pad');
var defatuls        = require('defaults');
var isES2016Keyword = require('is-es2016-keyword');

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

// Utils
function findClosestNonNativeAncestorFrameIdx (stackFrames, curIdx) {
    for (var i = curIdx + 1; i < stackFrames.length; i++) {
        if (!stackFrames[i].isNative())
            return i;
    }

    return null;
}

function highlight (src, renderer) {
    return src.replace(jsTokensRe, function (value) {
        var match = [];

        for (var i = 0; i < arguments.length; i++)
            match.push(arguments[i]);

        var token = jsTokensRe.matchToToken(match);

        if (token.type === 'name' && isES2016Keyword(value, true))
            token.type = 'keyword';

        if (renderer.syntax[token.type]) {
            return value
                .split(NEWLINE)
                .map(function (str) {
                    return renderer.syntax[token.type](str);
                })
                .join('\n');
        }

        return value;
    });
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
var CallsiteRecord = module.exports = function (fnName, typeName) {
    this.filename         = null;
    this.lineNum          = null;
    this.callsiteFrameIdx = null;
    this.stackFrames      = callsite();

    // NOTE: remove CallsiteRecord ctor call frame
    this.stackFrames.shift();

    if (typeName && fnName === 'constructor')
        fnName = typeName;

    this._extractCallsiteInfo(fnName, typeName);
};

// Decorators
CallsiteRecord.renderers = {
    default: require('./renderers/default'),
    noColor: require('./renderers/no-color'),
    html:    require('./renderers/html')
};

CallsiteRecord.prototype._extractCallsiteInfo = function (fnName, typeName) {
    for (var i = 0; i < this.stackFrames.length; i++) {
        var frame        = this.stackFrames[i];
        var isMemberCall = typeName && frame.getMethodName() === fnName && frame.getTypeName() === typeName;

        if (isMemberCall || frame.getFunctionName() === fnName) {
            this.callsiteFrameIdx = findClosestNonNativeAncestorFrameIdx(this.stackFrames, i);

            if (this.callsiteFrameIdx !== null) {
                var callsiteFrame = this.stackFrames[this.callsiteFrameIdx];

                this.filename = callsiteFrame.getFileName();
                this.lineNum  = callsiteFrame.getLineNumber() - 1;
            }

            return;
        }
    }
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
        line.num = leftPad(line.num, maxLineNumDigits);
    });

    return frameLines;
};

CallsiteRecord.prototype._renderCodeFrame = function (fileContent, renderer, frameSize) {
    if (renderer.syntax)
        fileContent = highlight(fileContent, renderer);

    var frame = this._getCodeFrameLines(fileContent, frameSize)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + renderer.codeLine(line.num, line.base, line.src);
        }, '')
        .replace(/\n$/, '');

    return renderer.codeFrame(frame);
};


CallsiteRecord.prototype._renderStack = function (renderer, stackFilter) {
    var rendered = '';

    for (var i = this.callsiteFrameIdx; i < this.stackFrames.length; i++) {
        var frame = this.stackFrames[i];

        if (!stackFilter || stackFilter(frame, i - this.callsiteFrameIdx)) {
            var name     = getFrameName(frame);
            var location = getFrameLocation(frame);

            rendered += renderer.stackLine(name, location);
        }
    }

    return rendered ? renderer.stack(rendered) : '';
};

CallsiteRecord.prototype._renderRecord = function (fileContent, opts) {
    opts = defatuls(opts, {
        renderer:    CallsiteRecord.renderers.default,
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

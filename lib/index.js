var fs              = require('fs');
var Promise         = require('pinkie-promise');
var callsite        = require('callsite');
var jsTokensRe      = require('js-tokens');
var leftPad         = require('left-pad');
var defatuls        = require('defaults');
var isES2016Keyword = require('is-es2016-keyword');

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

// Utils
function findClosestNonNativeAncestorFrame (stackFrames, curIdx) {
    for (var i = curIdx + 1; i < stackFrames.length; i++) {
        if (!stackFrames[i].isNative())
            return stackFrames[i];
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

// CallsiteRecord
var CallsiteRecord = module.exports = function (fnName, typeName) {
    this.filename = null;
    this.lineNum  = null;

    if (typeName && fnName === 'constructor')
        fnName = typeName;

    var stackFrames = callsite();

    // NOTE: remove CallsiteRecord ctor call frame
    stackFrames.shift();

    this._extractCallsiteInfo(stackFrames, fnName, typeName);
};

// Decorators
CallsiteRecord.renderers = {
    default: require('./renderers/default'),
    noColor: require('./renderers/no-color')
};

CallsiteRecord.prototype._extractCallsiteInfo = function (stackFrames, fnName, typeName) {
    for (var i = 0; i < stackFrames.length; i++) {
        var frame        = stackFrames[i];
        var isMemberCall = typeName && frame.getMethodName() === fnName && frame.getTypeName() === typeName;

        if (isMemberCall || frame.getFunctionName() === fnName) {
            var ancestorFrame = findClosestNonNativeAncestorFrame(stackFrames, i);

            if (ancestorFrame) {
                this.filename = ancestorFrame.getFileName();
                this.lineNum  = ancestorFrame.getLineNumber() - 1;
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

CallsiteRecord.prototype._renderRecord = function (fileContent, opts) {
    opts = defatuls(opts, {
        renderer:  CallsiteRecord.renderers.default,
        frameSize: 5
    });

    if (opts.renderer.syntax)
        fileContent = highlight(fileContent, opts.renderer);

    return this._getCodeFrameLines(fileContent, opts.frameSize)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + opts.renderer.codeLine(line.num, line.base, line.src);
        }, '')
        .replace(/\n$/, '');
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

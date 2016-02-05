var readFile       = require('fs').readFileSync;
var callsite       = require('callsite');
var jsTokensRe     = require('js-tokens');
var leftPad        = require('left-pad');
var isReservedWord = require('esutils').keyword.isReservedWordES6;

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

// API
module.exports = function callsiteFrame (fnName, typeName, decorator, frameSize) {
    if (typeName && fnName === 'constructor')
        fnName = typeName;

    var stackFrames = callsite();

    // NOTE: remove lib API call frame
    stackFrames.shift();

    for (var i = 0; i < stackFrames.length; i++) {
        var frame        = stackFrames[i];
        var isMemberCall = typeName && frame.getMethodName() === fnName && frame.getTypeName() === typeName;

        if (isMemberCall || frame.getFunctionName() === fnName) {
            var ancestorFrame = findClosestNonNativeAncestorFrame(stackFrames, i);

            if (ancestorFrame) {
                var filename = ancestorFrame.getFileName();
                var lineNum  = ancestorFrame.getLineNumber() - 1;

                return createSourceFrame(filename, lineNum, decorator, frameSize);
            }

            return null;
        }
    }

    return null;
};

// Decorators
var decorators = module.exports.decorators = {
    default: {
        line: function (num, base, src) {
            var prefix = base ? ' > ' : '   ';

            return prefix + num + ' |' + src + '\n';
        }
    }
};

// Internals
function highlight (src, decorator) {
    return src.replace(jsTokensRe, function (value) {
        var token = jsTokensRe.matchToToken.apply(jsTokensRe, arguments);

        if (token.type === 'name' && isReservedWord(value, true))
            token.type = 'keyword';

        if (decorator[token.type]) {
            return value
                .split(NEWLINE)
                .map(function (str) {
                    return decorator[token.type](str);
                })
                .join('\n');
        }

        return value;
    });
}

function getFrameLines (filename, baseLineIdx, decorator, frameSize) {
    var content = readFile(filename).toString();

    content = highlight(content, decorator);

    var lines            = content.split(NEWLINE);
    var startLineIdx     = Math.max(0, baseLineIdx - frameSize);
    var endLineIdx       = Math.min(lines.length - 1, baseLineIdx + frameSize);
    var maxLineNumDigits = 0;
    var frameLines       = [];

    for (var i = startLineIdx; i <= endLineIdx; i++) {
        var num = String(i + 1);

        maxLineNumDigits = Math.max(maxLineNumDigits, num.length);

        frameLines.push({
            num:  num,
            src:  lines[i],
            base: i === baseLineIdx
        });
    }


    frameLines.forEach(function (line) {
        line.num = leftPad(line.num, maxLineNumDigits);
    });

    return frameLines;
}

function createSourceFrame (filename, baseLineIdx, decorator, frameSize) {
    decorator = decorator || decorators.default;
    frameSize = frameSize || 2;

    return getFrameLines(filename, baseLineIdx, decorator, frameSize)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + decorator.line(line.num, line.base, line.src);
        }, '');
}

function findClosestNonNativeAncestorFrame (stackFrames, curIdx) {
    for (var i = curIdx + 1; i < stackFrames.length; i++) {
        if (!stackFrames[i].isNative())
            return stackFrames[i];
    }

    return null;
}


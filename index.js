var readFile       = require('fs').readFileSync;
var callsite       = require('callsite');
var jsTokensRe     = require('js-tokens');
var leftPad        = require('left-pad');
var isReservedWord = require('esutils').keyword.isReservedWordES6;

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

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
    var content          = readFile(filename).toString();
    var lines            = content.split(NEWLINE);
    var startLineIdx     = Math.max(0, baseLineIdx - frameSize);
    var endLineIdx       = Math.min(lines.length - 1, baseLineIdx + frameSize);
    var maxLineNumDigits = 0;
    var frameLines       = [];
    var sources          = [];
    var lineNumbers      = [];

    for (var i = startLineIdx; i <= endLineIdx; i++) {
        var num = String(i);

        maxLineNumDigits = Math.max(maxLineNumDigits, num.length);

        lineNumbers.push(num);
        sources.push(lines[i]);
    }

    sources = highlight(sources.join('\n'), decorator).split(NEWLINE);

    frameLines.forEach(function (line) {
        line.num = leftPad(line.num, maxLineNumDigits);
    });

    return sources.map(function (src, idx) {
        return {
            src:  src,
            num:  leftPad(lineNumbers[idx], maxLineNumDigits),
            base: idx === baseLineIdx - startLineIdx
        };
    });
}

function createSourceFrame (filename, baseLineIdx, decorator, frameSize) {
    decorator = decorator || exports.decorators.default;
    frameSize = frameSize || 2;

    return getFrameLines(filename, baseLineIdx, decorator, frameSize)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + decorator.line(line.num, line.base, line.src);
        }, '');
}


// API
module.exports = function (fnName, typeName, decorator, frameSize) {
    if (typeName && fnName === 'constructor')
        fnName = typeName;

    var stackFrames = callsite();

    // NOTE: remove lib API call frame
    stackFrames.shift();

    for (var i = 0; i < stackFrames.length; i++) {
        var frame        = stackFrames[i];
        var nextFrame    = stackFrames[i + 1];
        var isMemberCall = typeName && frame.getMethodName() === fnName && frame.getTypeName() === typeName;

        if ((isMemberCall || frame.getFunctionName() === fnName) && nextFrame)
            return createSourceFrame(nextFrame.getFileName(), nextFrame.getLineNumber() - 1, decorator, frameSize);
    }

    return null;
};

// Decorators
exports.decorators = {
    default: {
        line: function (num, base, src) {
            var prefix = base ? '> ' : '  ';

            return prefix + num + ' |' + src + '\n';
        }
    }
};

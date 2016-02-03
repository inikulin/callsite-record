var readFile       = require('fs').readFileSync;
var callsite       = require('callsite');
var jsTokensRe     = require('js-tokens');
var leftPad        = require('left-pad');
var isReservedWord = require('esutils').keyword.isReservedWordES6;

function getFrameLines (filename, baseLineIdx, frameSize) {
    frameSize = frameSize || 2;

    var content          = readFile(filename);
    var lines            = content.split(/\r?\n/g);
    var startLineIdx     = Math.max(0, baseLineIdx - frameSize);
    var endLineIdx       = Math.min(lines.length - 1, baseLineIdx + frameSize);
    var maxLineNumDigits = 0;
    var frameLines       = [];

    for (var i = startLineIdx; i <= endLineIdx; i++) {
        var num = String(i);

        maxLineNumDigits = Math.max(maxLineNumDigits, num.length);

        frameLines.push({ num: num, base: i === baseLineIdx, src: lines[i] });
    }

    frameLines.forEach(function (line) {
        line.num = leftPad(line.num, maxLineNumDigits);
    });

    return frameLines;
}

function highlight (src, decorator) {
    return src.replace(jsTokensRe, function () {
        var token = jsTokensRe.matchToToken.apply(jsTokensRe, arguments);

        if (token.type === 'name' && isReservedWord(token.value, true))
            token.type = 'keyword';

        return decorator[token.type] ? decorator[token.type](token.value) : token.value;
    });
}

function createSourceFrame (filename, baseLineIdx, decorator, frameSize) {
    // TODO decorator

    return getFrameLines(filename, baseLineIdx, frameSize)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + decorator.line(line.num, line.base, highlight(line.src));
        }, '');
}


exports.forFn = function (fnName, decorator, frameSize) {
    // TODO
};

exports.forMember = function (objName, fnName, decorator, frameSize) {
    // TODO
};

exports.forStackFrame = function (idx, decorator, frameSize) {
    // TODO
};



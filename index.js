var readFile       = require('fs').readFileSync;
var callsite       = require('callsite');
var jsTokensRe     = require('js-tokens');
var isReservedWord = require('esutils').keyword.isReservedWordES6;

function getFrameLines (filename, baseLineIdx) {
    var content       = readFile(filename);
    var lines         = content.split(/\r?\n/g);
    var prefixLineIdx = baseLineIdx - 1;
    var suffixLineIdx = baseLineIdx + 1;
    var frameLines    = [];

    if (prefixLineIdx >= 0) {
        frameLines.push({
            num:  prefixLineIdx,
            base: false,
            src:  lines[prefixLineIdx]
        });
    }

    frameLines.push({
        num:  baseLineIdx,
        base: true,
        src:  lines[baseLineIdx]
    });

    if (suffixLineIdx < lines.length) {
        frameLines.push({
            num:  suffixLineIdx,
            base: false,
            src:  lines[suffixLineIdx]
        });
    }
}

function highlight (src, decorator) {
    return src.replace(jsTokensRe, function () {
        var token = jsTokensRe.matchToToken.apply(jsTokensRe, arguments);

        if (token.type === 'name' && isReservedWord(token.value, true))
            token.type = 'keyword';

        return decorator[token.type] ? decorator[token.type](token.value) : token.value;
    });
}

function createSourceFrame (filename, baseLineIdx, decorator) {
    // TODO decorator

    return getFrameLines(filename, baseLineIdx)
        .reduce(function (sourceFrame, line) {
            return sourceFrame + decorator.line(line.num, line.base, highlight(line.src));
        }, '');
}


exports.forFn = function (fnName, decorator) {
    // TODO
};

exports.forMember = function (objName, fnName, decorator) {
    // TODO
};

exports.forStackFrame = function (idx, decorator) {
    // TODO
};



var escapeHtml = require('escape-html');

module.exports = {
    syntax: ['string', 'punctuator', 'keyword', 'number', 'regex', 'comment', 'invalid'].reduce(function (syntaxRenderer, tokenType) {
        syntaxRenderer[tokenType] = function (str) {
            return '<span class="syntax-' + tokenType + '">' + escapeHtml(str) + '</span>';
        };

        return syntaxRenderer;
    }, {}),

    codeFrame: function (str) {
        return '<div class="code-frame">\n' +
               str +
               '</div>';
    },

    codeLine: function (num, base, src, isLast) {
        var lineClass = isLast ? 'code-line-last' : 'code-line';
        var numClass  = base ? 'code-line-num-base' : 'code-line-num';

        return '    <div class="' + lineClass + '">\n' +
               '        <div class="' + numClass + '">' + num + '</div>\n' +
               '        <div class="code-line-src">' + src + '</div>\n' +
               '    </div>\n';
    },

    stackLine: function (name, location, isLast) {
        var lineClass = isLast ? 'stack-line-last' : 'stack-line';

        return '    <div class="' + lineClass + '">\n' +
               '        <div class="stack-line-name">' + escapeHtml(name) + '</div>\n' +
               '        <div class="stack-line-location">' + escapeHtml(location) + '</div>\n' +
               '    </div>\n';
    },

    stack: function (stack) {
        return '\n<div class="stack">\n' +
               stack +
               '</div>';
    }
};

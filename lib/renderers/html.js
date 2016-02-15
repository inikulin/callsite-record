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

    codeLine: function (num, base, src) {
        var numClass = base ? 'line-num base' : 'line-num';

        return '    <div class="code-line">\n' +
               '        <div class="' + numClass + '">' + num + '</div>\n' +
               '        <div class="src">' + src + '</div>\n' +
               '    </div>\n';
    },

    stackLine: function (name, location) {
        return '    <div class="stack-line">\n' +
               '        <div class="name">' + escapeHtml(name) + '</div>\n' +
               '        <div class="location">' + escapeHtml(location) + '</div>\n' +
               '    </div>\n';
    },

    stack: function (stack) {
        return '\n<div class="stack">\n' +
               stack +
               '</div>';
    }
};

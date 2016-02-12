var escapeHtml = require('escape-html');

module.exports = {
    syntax: ['string', 'punctuator', 'keyword', 'number', 'regex', 'comment', 'invalid'].reduce(function (syntaxRenderer, tokenType) {
        syntaxRenderer[tokenType] = function (str) {
            return '<span class="syntax-' + tokenType + '">' + escapeHtml(str) + '</span>';
        };

        return syntaxRenderer;
    }, {}),

    codeFrame: function (str) {
        return '<div class="code-frame">' + str + '</div>\n';
    },

    codeLine: function (num, base, src) {
        var numClass = base ? 'line-num base' : 'line-num';

        return '<div class="code-line">\n' +
               '    <div class="' + numClass + '">' + num + '</div>\n' +
               '    <div class="src">' + src + '</div>\n' +
               '</div>\n';
    }
};

var escapeHtml = require('escape-html');

module.exports = {
    syntax: ['string', 'punctuator', 'keyword', 'number', 'regex', 'comment', 'invalid'].reduce(function (syntaxRenderer, tokenType) {
        syntaxRenderer[tokenType] = function (str) {
            return '<span class="syntax-' + escapeHtml(tokenType) + '">' + str + '</span>';
        };

        return syntaxRenderer;
    }, {}),

    codeFrame: function (str) {
        return '<div class="code-frame">' + str + '</div>';
    },

    codeLine: function (num, base, src) {
        var numClass = base ? 'line-num base' : 'line-num';

        return '<div class="code-line">' +
               '    <div class="' + numClass + '">' + num + '</div>' +
               '    <div class="src">' + src + '</div>' +
               '</div>';
    }
};

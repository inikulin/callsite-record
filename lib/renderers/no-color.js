var asIs = require('identity-function');

module.exports = {
    codeFrame: asIs,

    codeLine: function (num, base, src) {
        var prefix = base ? ' > ' : '   ';

        return prefix + num + ' |' + src + '\n';
    },

    stackLine: function (name, location) {
        return '   at ' + name + ' (' + location + ')\n';
    },

    stack: function (stack) {
        return '\n\n' + stack;
    }
};

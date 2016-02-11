var asIs = require('identity-function');

module.exports = {
    codeFrame: asIs,

    codeLine: function (num, base, src) {
        var prefix = base ? ' > ' : '   ';

        return prefix + num + ' |' + src + '\n';
    }
};

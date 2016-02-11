var chalk = require('chalk');
var asIs  = require('identity-function');

module.exports = {
    syntax: {
        string:     chalk.green,
        punctuator: chalk.grey,
        keyword:    chalk.cyan,
        number:     chalk.magenta,
        regex:      chalk.magenta,
        comment:    chalk.grey.bold,
        invalid:    chalk.inverse
    },

    codeFrame: asIs,

    codeLine: function (num, base, src) {
        var prefix  = base ? ' > ' : '   ';
        var lineNum = prefix + num + ' ';

        if (base)
            lineNum = chalk.bgRed(lineNum);

        return lineNum + '|' + src + '\n';
    }
};

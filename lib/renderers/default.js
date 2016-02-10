var chalk = require('chalk');

module.exports = {
    syntax: {
        string:     chalk.green,
        punctuator: chalk.grey,
        keyword:    chalk.cyan,
        number:     chalk.magenta,
        regex:      chalk.magenta,
        comment:    chalk.yellow,
        invalid:    chalk.inverse
    },

    codeLine: function (num, base, src) {
        var prefix = base ? ' > ' : '   ';

        return prefix + num + ' |' + src + '\n';
    }
};

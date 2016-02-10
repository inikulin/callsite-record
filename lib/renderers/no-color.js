module.exports = {
    codeLine: function (num, base, src) {
        var prefix = base ? ' > ' : '   ';

        return prefix + num + ' |' + src + '\n';
    }
};

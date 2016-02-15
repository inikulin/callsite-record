var fs = require('fs');

module.exports = [];

for (var i = 0; i < 6; i++)
    module.exports.push(fs.readFileSync('test/data/expected-html/' + i + '.html').toString().trim());

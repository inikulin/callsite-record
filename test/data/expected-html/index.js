var fs   = require('fs');
var join = require('path').join;

var getRecordsFile = join(__dirname, '../get-records.js');
var recordsFile    = join(__dirname, '../records.js');


module.exports = [];

for (var i = 0; i < 6; i++) {
    var expectedFrame = fs.readFileSync('test/data/expected-html/' + i + '.html')
        .toString()
        .trim()
        .replace(/\{\{\{get-records-file\}\}\}/g, getRecordsFile)
        .replace(/\{\{\{records-file\}\}\}/g, recordsFile);

    module.exports.push(expectedFrame);
}

var inspect = require('eyespect').inspector()
var exec = require('child_process').exec
module.exports = function(filePath, cb) {
  var cmd = 'pdftotext'
  var args = [
      '-layout',
      '-enc',
      'UTF-8',
    filePath,
      '-'
  ];
  var command = cmd + ' ' + args.join(' ')
  var child = exec(command, function(err, stdout, stderr) {
    if (err) {
        return cb({
          message: 'pdf-text-extract failed',
          error: err,
          filePath: filePath,
          command: command,
          stack: new Error().stack
        })
    }
    var pages = stdout.split(/\f/);
    if (!pages) {
      return cb({
        message: 'pdf-text-extract failed',
        error: 'no text returned from the pdftotext command',
        filePath: filePath,
        command: command,
        stack: new Error().stack
      })
    }
    // sometimes there can be an extract blank page on the end
    var lastPage = pages[pages.length - 1]
    if (!lastPage) {
      pages.pop()
    }
    cb(stderr, pages);
  });
}

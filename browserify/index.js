var fs = require('fs');
var browserify = require('browserify');

var bundleFs = fs.createWriteStream(__dirname + '/bundle.js');
var b = browserify();

var _source_path = require('path').join(__dirname, '..', 'src').replace(/\\/g, '/');

var Readable = require('stream').Readable
var s = new Readable
s.push(`window.AtomParser = require('${_source_path}');`);
s.push(null)

b.add(s).transform('envify', { global: true }).bundle().pipe(require('minify-stream')()).pipe(bundleFs)
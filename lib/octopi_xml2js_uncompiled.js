// This is a thin wrapper around xml2js so that we can use node-js and browserify to compile it into one javascript file
// To update xml2js/to recompile, first install nodejs and npm
// Then:
// npm install -g browserify
// npm install xml2js
// browserify octopi_xml2js_uncompile.js -o octopi_xml2js.js

var xml2js = require('xml2js');
octopi_xml2js = function(input, callback) {
    var parser = new xml2js.Parser();
    return parser.parseString(input, callback);
}

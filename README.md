# sskv-parser

semicolon separated key-value parser

Uses Stream.Transform.

By default, treats stream as semicolon-delimited.
Any other delimiter character may be passed to constructor.

On 'readable' event produces data, which would be a string if there was no equals sign,
or object if there was one.

Usage:

```
var fs = require('fs');

var Parser = require('sskv-parser');
var oParser = new Parser(/*charDelimiter = ';'*/);

var sStream = fs.createReadStream('path/to/sskv/file.txt');
sStream.pipe(oParser);

oParser.on('readable', function(){
	oData = this.read();
	
	console.log(oData);
});
```
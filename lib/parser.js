/**
 * //@by_rcmonitor@//
 * on 19.08.2015.
 */

var util = require('util');
var Transform = require('stream').Transform;

util.inherits(Parser, Transform);

function Parser(chDelimeter){
	Transform.call(this, {objectMode: true});

	if(!chDelimeter){
		chDelimeter = ';';
	}

	this.delimeter = chDelimeter;
	this.errors = [];

}


Parser.prototype._transform = function(chunk, encoding, fCallback){

	var strLine = chunk.toString();
	strLine = strLine.replace('\r\n', '');
	strLine = strLine.replace('\n', '');

	if(this.lineAppendix){
		strLine = this.lineAppendix + strLine;
	}

	var arLines = strLine.split(this.delimeter);

	this.lineAppendix = arLines.pop();

	arLines.forEach(this.parseValue, this);

	fCallback();
};


Parser.prototype._flush = function(fCallback){
	if(this.lineAppendix){
		this.parseValue(this.lineAppendix);
	}

	this.lineAppendix = null;

	fCallback();
};


Parser.prototype.parseValue = function(strElement, intIndex, arArray){

	var intEqualsPosition = strElement.indexOf('=');

	if(intEqualsPosition == -1){
		this.push(strElement);
	}else{
		var strKey = strElement.slice(0, intEqualsPosition);
		var strValue = strElement.slice(intEqualsPosition + 1);

		var oReturn = {};
		oReturn[strKey] = strValue;

		this.push(oReturn);
	}

};


module.exports = Parser;
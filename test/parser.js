/**
 * //@by_rcmonitor@//
 * on 19.08.2015.
 */

var fs = require('fs');
var Stream = require('stream');

require('chai').should();

var Parser = require('../index');

describe('parser test', function(){


	var testParser = function(oParser, arExpected, fCallback){
		var intOffset = 0;

		oParser.on('readable', function(){
			var data = oParser.read();

			data.should.eql(arExpected[intOffset]);

			intOffset ++;
		});

		oParser.on('end', function(){
			fCallback();
		})
	};

	describe('#readable event', function(){
		it('should return correct data from file', function(fCallback){

			var arExpected = [
				'0', {
					"url": "http://hhid.ru/hhid/revalidate?primaryhost=http://hh.ru&backurl=http%3A%2F%2Fhh.ru%2Fapplicant%2Fresumes%2Ftouch&stage=3&token=8xvrpoFu7lDEwPKGvftW9w0l0K"
				}
			];

			var oParser = new Parser();

			var sKeyValue = fs.createReadStream('./test/data/string.test');

			sKeyValue.pipe(oParser);

			testParser(oParser, arExpected, fCallback);

		});

		it('should return correct data from string', function(fCallback){
			var strData = 'some=value;any;moar=big_value';
			var arExpected = [
				{"some": "value"},
				"any",
				{"moar": "big_value"}
			];

			var sString = new Stream.Readable();

			sString._read = function noop(){};

			var oParser = new Parser();

			sString.pipe(oParser);

			sString.push(strData);
			sString.push(null);

			testParser(oParser, arExpected, fCallback);

		});

		it('should return correct data with comma delimiter', function(fCallback){

			var strData = '1567,dummy key=dummy value,some1469moar,any_key=42';
			var arExpected = [
				"1567",{
					"dummy key": "dummy value"
				}, "some1469moar", {
					"any_key": "42"
				}
			];

			var oParser = new Parser(',');

			var sString = new Stream.Readable();
			sString._read = function noop(){};

			sString.pipe(oParser);

			sString.push(strData);
			sString.push(null);

			testParser(oParser, arExpected, fCallback);
		});
	})
});

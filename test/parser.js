/**
 * //@by_rcmonitor@//
 * on 19.08.2015.
 */

var fs = require('fs');

require('chai').should();

var Parser = require('../index');

describe('parser test', function(){

	describe('#readable event', function(){
		it('should return correct data', function(fCallback){

			var arExpected = [
				'0', {
					"url": "http://hhid.ru/hhid/revalidate?primaryhost=http://hh.ru&backurl=http%3A%2F%2Fhh.ru%2Fapplicant%2Fresumes%2Ftouch&stage=3&token=8xvrpoFu7lDEwPKGvftW9w0l0K"
				}
			];

			var oParser = new Parser();

			var sKeyValue = fs.createReadStream('./test/data/string.test');

			sKeyValue.pipe(oParser);

			var intOffset = 0;

			oParser.on('readable', function(){
				var data = oParser.read();

				data.should.eql(arExpected[intOffset]);

				intOffset ++;

			});

			oParser.on('end', function(){
				fCallback();
			});

		})
	})
});

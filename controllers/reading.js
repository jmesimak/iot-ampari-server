'use strict';
var _ = require('lodash');
var db = require('../db');
module.exports = function(app) {
	const AVG_STEPS = 12;

	Array.prototype.chunk = function ( n ) {
	    if ( !this.length ) {
	        return [];
	    }
	    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
	};

	function calculateAvgByStep(readings) {
		let deviceReadings = _.groupBy(readings, 'device');
		let deviceReadingsChunked = _.map(deviceReadings, (deviceReadings) => {
			return deviceReadings
					.chunk(AVG_STEPS)
					.map((chunk) => {
						return _.sortBy(chunk, 'value');
					})
					.reduce((medians, sortedChunk) => {
						let medianReading = sortedChunk[sortedChunk.length/2];
						medians.push(medianReading)
						return medians;
					}, []);
		});
		return deviceReadingsChunked;
	}

	app.get('/device/:id/readings', (request, response) => {
		let plantId = request.params.id;
		let startTimeDefault = (new Date()).setHours(new Date().getHours() - 12);
		let startTime = request.query.start || startTimeDefault;
		let endTime = request.query.end || new Date();
		db.query(
			`
			 SELECT *
			 FROM READING
			 WHERE device = $1 AND recorded > $2 AND recorded < $3
			`,
			[plantId, new Date(startTime), new Date(endTime)]
		).then((readings) => {
			console.log('zomg!');
			console.log(readings);
			response.json(calculateAvgByStep(readings));
		}).catch((e) => {
			console.log(':(');
			console.log(e);
		});
	});
}

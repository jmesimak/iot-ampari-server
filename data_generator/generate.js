'use strict';

var db = require('../db');

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveReading(recorded, value) {
	db.query(
		'INSERT INTO reading (recorded, device, value) VALUES ($1, $2, $3)',
		[recorded, 1, Math.round(value)]
	);
}

function generateDailySoilData(d) {
	let DAILY_MAX = getRandomIntInclusive(700, 900);
	let DAILY_MIN = 400;
	let DAILY_READINGS = 24*(60/5);

	let STEP = (DAILY_MAX - DAILY_MIN) / DAILY_READINGS;
	let currentHumidity = DAILY_MAX;
	let readings = [];
	for (var i = 0; i < DAILY_READINGS; i++) {
		//generateReading(d, currentHumidity);
		readings.push({
			recorded: new Date(d),
			value: currentHumidity
		});
		d.setMinutes(d.getMinutes() + 5);
		currentHumidity -= STEP;
	}

	readings.map((r) => {
		saveReading(r.recorded, r.value)
	})

}

function generateYearlySoilData() {
	
	let startDate = new Date('2016-01-01');

	for (var i = 0; i < 365; i++) {
		console.log(`Populating day ${i}`);
		generateDailySoilData(startDate);

	}
}

generateYearlySoilData();
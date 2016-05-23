'use strict';

var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));

var conString = process.env.POSTGRE_URL || "";

var client;

pg.connect(conString, function(err, dbclient, done) {
	client = dbclient;
	startServer();
	console.log(err);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/device/:id/reading', (request, response) => {
	console.log(request.params);
	console.log(request.body);
	client.query(
		`INSERT INTO reading (recorded, device, value) VALUES ($1, $2, $3)`,
		[new Date(), request.params.id, request.body.readingValue],
		(error, result) => {
			if (error) {
				console.log(error);
				response.status(500).json({message: 'fubar'});
			} else {
				response.json({message: 'ok'});
			}
		}
	);
});

app.get('/plant/:id/readings', (request, response) => {
	client.query(
		`SELECT * from reading`,
		(error, result) => {
			response.json(result.rows);
		}
	)
});

function startServer() {
	app.listen(app.get('port'), function() {
  		console.log('Example app listening on port 3000!');
	});
}

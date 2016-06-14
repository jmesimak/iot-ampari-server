'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db');
var readingCtrl = require('./controllers/reading')(app);

app.use(bodyParser.json());


app.use(function(req, res, next) {
  console.log('dank stuff');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.set('port', (process.env.PORT || 3000));




// var client;



app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/device/:id/reading', (request, response) => {
	db.query(
		`INSERT INTO reading (recorded, device, value) VALUES ($1, $2, $3)`,
		[new Date(), request.params.id, request.body.readingValue]
	).then((result) => {
		if (error) {
			console.log(error);
			response.status(500).json({message: 'fubar'});
		} else {
			response.json({message: 'ok'});
		}
	});
});

// app.get('/plant/:id/readings', (request, response) => {
// 	client.query(
// 		`SELECT * from reading`,
// 		(error, result) => {
// 			response.json(result.rows);
// 		}
// 	)
// });

function startServer() {
	app.listen(app.get('port'), function() {
  		console.log('Example app listening on port 3000!');
	});
}

startServer();

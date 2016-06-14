var pg = require('pg');

var conString = process.env.POSTGRE_URL || "postgresql://localhost:5432/ghiot";

module.exports = {
	query: function(text, values) {
		return new Promise((resolve, reject) => {
			try {
				pg.connect(conString, function(err, dbclient, done) {
					dbclient.query(text, values, (error, results) => {
						done();
						resolve(results.rows);
					});
				});
			} catch(e) {
				console.log('somethan wrang!')
				console.log(e);
				reject(e);
			}

		});
	}
};
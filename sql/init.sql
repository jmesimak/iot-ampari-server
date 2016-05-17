CREATE TABLE plant (
	id		SERIAL PRIMARY KEY,
	name	TEXT NOT NULL
);

CREATE TABLE device_type (
	id		SERIAL PRIMARY KEY,
	name	TEXT NOT NULL
);

INSERT INTO device_type (name) VALUES ('humidity');
INSERT INTO device_type (name) VALUES ('temperature');
INSERT INTO device_type (name) VALUES ('light');
INSERT INTO device_type (name) VALUES ('air_pressure');
INSERT INTO device_type (name) VALUES ('oxygen');
INSERT INTO device_type (name) VALUES ('carbon');

CREATE TABLE device (
	id				SERIAL PRIMARY KEY,
	name			TEXT NOT NULL,
	plant			INT REFERENCES plant(id) NOT NULL,
	type			INT REFERENCES device_type(id) NOT NULL
);

CREATE TABLE reading (
	id				SERIAL PRIMARY KEY,
	recorded		TIMESTAMP NOT NULL,
	device			INT REFERENCES device(id) NOT NULL,
	value 			DOUBLE PRECISION NOT NULL
);
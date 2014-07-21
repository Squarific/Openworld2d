CREATE TABLE IF NOT EXISTS accounts (
	userid BIGINT AUTO_INCREMENT,
	username VARCHAR(64),
	password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS companys (
	companyid BIGINT AUTO_INCREMENT,
	companyname VARCHAR(64),
	money BIGINT
);

CREATE TABLE IF NOT EXISTS generatedRegions (
	x BIGINT,
	y BIGINT
);

CREATE TABLE IF NOT EXISTS towns (
	townid BIGINT AUTO_INCREMENT,
	population BIGINT,
	name VARCHAR(64),
	x BIGINT,
	y BIGINT
);

CREATE TABLE IF NOT EXISTS rails (
	railid BIGINT AUTO_INCREMENT,
	ownerid BIGINT,
	startX BIGINT,
	startY BIGINT,
	endX BIGINT,
	endY BIGINT
);

CREATE TABLE IF NOT EXISTS trains (
	trainid BIGINT AUTO_INCREMENT,
	ownerid BIGINT,
	traintype INT,
	starttime TIMESTAMP,
	startX BIGINT,
	startY BIGINT,
	endX BIGINT,
	endY BIGINT
);

CREATE TABLE IF NOT EXISTS cargo (
	containerid BIGINT,
	containertype INT, /* 0: TOWN, 1: TRAIN, 2: INDUSTRY */
	cargotype INT,
	cargosize BIGINT,
	generatedtime TIMESTAMP,
	destinationX BIGINT,
	destinationY BIGINT
);
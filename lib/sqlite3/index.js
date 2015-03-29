'use strict';

var fs = require('fs'),
	sqlite3 = require('sqlite3');

module.exports = function(Config, Logger){
	Logger.info('Starting Data Server with SQLite3...');

	if ( !fs.existsSync( 'data' ) ) {
		fs.mkdirSync( 'data' );
	}
	var db = new sqlite3.Database('./data/develop.sqlite');

	db.serialize(function() {
		//db.run("DROP TABLE lorem");
		db.run("CREATE TABLE lorem (info TEXT)");

		var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
		for (var i = 0; i < 10; i++) {
			stmt.run("Ipsum " + i);
		}
		stmt.finalize();

		db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
			Logger.info(row.id + ": " + row.info);
		});
	});

	db.close();

};

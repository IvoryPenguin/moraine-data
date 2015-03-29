'use strict';

var bodyParser = require('body-parser'),
	express = require('express');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json+search' }));

module.exports = function(type){

	return function(Config, Logger) {
		Logger.info('starting data server...');

		var db = require('./' + type)(Config, Logger);

		db.save({
			environment: 'dev',
			namespace: 'pets',
			collection: 'cats',
			payload: {
				message: 'hello'
			}
		});

		db.save({
			environment: 'dev',
			namespace: 'pets',
			collection: 'cats',
			payload: {
				message: 'goodbye'
			}
		});

		db.save({
			environment: 'dev',
			namespace: 'pets',
			collection: 'cats',
			payload: {
				message: 'goodbye'
			}
		});

		app.get('/*', function (req, res) {
			var url = req.url;

			var split = url.match(/^\/([^/]+)\/([^/]+)\/(.*)$/);

			if(split){
				db.findById({
					environment: req.headers.environment || 'dev',
					namespace: split[1],
					collection: split[2],
					id: split[3]
				}).then(function(payload){
					res.json(payload)
				}, function(error){
					res.status(404).json({
						message: error
					});
				});
			}
		});

		app.delete('/*', function (req, res) {
			var url = req.url;

			var split = url.match(/^\/([^/]+)\/([^/]+)\/(.*)$/);

			if(split){
				db.delete({
					environment: req.headers.environment || 'dev',
					namespace: split[1],
					collection: split[2],
					id: split[3]
				}).then(function(payload){
					res.json(payload)
				}, function(error){
					res.status(404).json({
						message: error
					});
				});
			}
		});

		app.post('/*', function (req, res) {
			var url = req.url;
			var split = url.match(/^\/([^/]+)\/([^/]+)\/?(.*)?$/);

			if(req.headers['content-type'] === 'application/json+search'){
				if(split[3]){
					res.status(400).json({
						message: 'no need to pass id when searching'
					})
				}
				db.search({
					environment: req.headers.environment || 'dev',
					namespace: split[1],
					collection: split[2],
					search: req.body
				}).then(function(payload){
					res.send(payload)
				}, function(error){
					res.status(404).json({
						message: error
					});
				});
			}

			if(req.headers['content-type'] === 'application/json'){
				db.save({
					environment: req.headers.environment || 'dev',
					namespace: split[1],
					collection: split[2],
					id: split[3],
					payload: req.body
				}).then(function(id){
					res.json({
						id: id
					});
				}, function(error){
					res.status(404).json({
						message: error
					});
				});
			}
		});

		var server = app.listen(3000, function () {

			var port = server.address().port;

			console.log('Example app listening on port %s', port);

		})

	}
};

'use strict';

var _ = require('lodash'),
	mkdirp = require('mkdirp'),
	tv4 = require('tv4'),
	uuid = require('uuid');

module.exports = function(Config, Logger) {

	var database = {};
	var schema = {
		"items": {
			"environment": "string",
			"collection": "string",
			"namespace": "string"
		}
	};

	return {
		all: function(options) {
			return new Promise(function(resolve, reject){

				try {
					var collection = database[options.environment][options.namespace][options.collection] = database[options.environment][options.namespace][options.collection];
					resolve(collection);
				} catch (error) {
					reject(error);
				}

			});
		},
		findById: function findById(options) {
			return new Promise(function(resolve, reject){

				try {
					var record = database[options.environment][options.namespace][options.collection][options.id];
					if(_.isUndefined(record)){
						reject('no record found');
					}
					resolve(record);
				} catch (error) {
					reject('no record found');
				}

			});
		},
		search: function search(options) {
			return new Promise(function(resolve, reject){
				var collection = database[options.environment][options.namespace][options.collection] = database[options.environment][options.namespace][options.collection];

				try {
					var filtered = {};

					_.each(collection, function (record, id) {
						_.every(_.keys(options.search), function (key) {
							if(options.search[key] === record[key]){
								filtered[id] = record;
							}
						});
					});

					resolve({
						records: filtered
					});
				} catch (error) {
					reject(error);
				}

			});

		},
		save: function save(options) {

			return new Promise(function(resolve, reject){

				options.id = options.id || uuid.v4();

				if(!tv4.validate(options, schema)){
					reject(validationError);
				}

				database[options.environment] = database[options.environment] || {};
				database[options.environment][options.namespace] = database[options.environment][options.namespace] || {};
				database[options.environment][options.namespace][options.collection] = database[options.environment][options.namespace][options.collection] || {};

				if(_.isObject(options.payload)){
					database[options.environment][options.namespace][options.collection][options.id] = options.payload;
				}

				resolve(options.id);
			});
		},
		delete: function remove(options) {
			return new Promise(function(resolve, reject){

				try {
					if(_.isUndefined(database[options.environment][options.namespace][options.collection][options.id])){
						reject('no record found')
					}
					delete database[options.environment][options.namespace][options.collection][options.id];
					resolve(true);
				} catch (error) {
					reject(error);
				}

			});

		},
		dump: function() {
			return database;
		}
	};
}

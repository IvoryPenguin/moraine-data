'use strict';

var moraine = require('moraine-boot');

moraine().then(function(moraineServer){

	var data = require('./lib')('memory');

	moraineServer.register(data);
	moraineServer.start();

}).catch(function(error){

	console.error(error);

});

var keystone = require('keystone');
var standard_page = require('./views/standard_page');
var debug = require('debug')('dreamspace:router');

/*
 * This module provides a router that will map model types to views
 */
 //could we maybe just start with 'module.exports'
module.exports = function(req, res) {

	var locals = res.locals;
  //other things can be changed later, just look at the Backup Drive

	var q = keystone.list('BasePage').model.findOne({
		fullPath: locals.full_path

	}).populate('blocks');

	q.exec(function(err, result) {
		debug('locals.full_path = ', locals.full_path);
		if (!result) {
			return res.notfound();
		}
		locals.page = result;
		if(result.__t === 'BasePage') {
			return standard_page(req, res);
		} else {
			return standard_page(req, res);
		}
	});
};

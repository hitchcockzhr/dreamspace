//eat my smeg
var keystone = require('keystone');
var async = require('async');

module.exports = function(req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/gallery'); //keep it at gallery for now, see where it goes
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

  view.render('session/join'); //find out more about this
}

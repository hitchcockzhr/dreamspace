//dont dick your friends girl
var keystone = require('keystone');
var async = require('async');

module.exports = function(req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/gallery');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	//eventually, you can only see posts that YOU made

	view.render('session/signin');

}

//generic comment
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

	//move error checking into here
	view.on('post', { action: 'signin' }, function(next) {

		if (!req.body.signin_email || !req.body.signin_password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}

		var onSuccess = function() {
			if (req.query && req.query.from) {
				res.redirect(req.query.from);
			} else {
				res.redirect('/gallery');
			}
		}

		var onFail = function() {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		}

		keystone.session.signin({ email: req.body.signin_email, password: req.body.signin_password }, req, res, onSuccess, onFail);

	});


	view.render('site/signin'); //no longer 'session' folder

}

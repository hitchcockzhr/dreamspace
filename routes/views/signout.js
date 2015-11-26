//third one
var keystone = require('keystone');

module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';

	keystone.session.signout(req, res, function() {
		//res.redirect('/');
		view.render('site/signout'); //new page
	});

};

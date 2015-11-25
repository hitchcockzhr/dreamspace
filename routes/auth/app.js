var keystone = require('keystone');

module.exports = function(req, res) { //always check with the exports

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.authUser = req.session.auth;

	view.render('auth/app');

}

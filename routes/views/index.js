//Simple template for connecting model to view
var keystone = require('keystone');

exports = module.exports = function(req, res) { //exports works here for some reason, even without BSON?

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Render the view
	view.render('index');

};

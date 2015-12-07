//Made to order, to display my past projects
var keystone = require('keystone');
var async = require('async');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'projPage';

	locals.data = {
		projects: []
	};

  // Load the projects
	view.on('init', function(next) {

		var q = keystone.list('Project').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate');


		q.exec(function(err, results) {
			locals.data.projects = results;
			next(err);
		});

	});

	// Render the view
  // Really need to think of a better name
	view.render('projPage');
};

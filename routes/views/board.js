//I need to get my shit together
var keystone = require('keystone');
var _ = require('underscore');
var async = require('async');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'board';
  locals.page.title = 'Shoutbox';

  locals.data = {
    messages: []
  };

  // Load the messages
	view.on('init', function(next) {

		var q = keystone.list('Message').model.find().where('state', 'published').sort('-publishedDate');

		q.exec(function(err, results) {
			locals.data.messages = results;
			next(err);
		});

	});

  view.render('board');

}

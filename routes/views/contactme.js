//lol?
var keystone = require('keystone');
var content_blocks = require('../lib/content_blocks');
var _ = require('underscore');

module.exports = function(req, res) {

   var view = new keystone.View(req, res);
   var locals = res.locals;

   locals.section = 'home';
   locals.data = {};

   //Load the current post
   view.on('init', function(next) {
     var q = keystone.list('StandardPage').model.findOne({
			slug: 'contactme'
		}).populate('blocks');
		published_filter(req.user, q);

		q.exec(function(err, result) {

			if (!result) {
				return res.notfound();
			}

			content_blocks.fetchContentBlocks(result, function() {
				locals.page = result;
				next(err);
			});

		});
   });

   view.render('contactme');

};

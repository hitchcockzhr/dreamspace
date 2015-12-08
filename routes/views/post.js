//Keystone Generated
var keystone = require('keystone');
var async = require('async');
var PostComment = keystone.list('PostComment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};

	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');

		q.exec(function(err, result) {
			locals.data.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function(next) {

		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});


//Load a comment
view.on('init', function(next){
	PostComment.model.find().where('post', locals.post).where('cmState', 'published').where('author').ne(null).populate('author').sort('-cmDate').exec(function (err, comments) {
		if(err){
			return res.err(err);
		}
		if(!comments){
			return res.notFound('No comment(s) found');
		}
		locals.comments = comments;
		next();
	});
});

	//Create a comment
	//we need to use an update handler
	//inspired by:
	// https://gist.github.com/JedWatson/9741171
	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newPostComment = new PostComment.model({
        state: 'published', //remember, this was changed
				post: locals.post.id,
				author: locals.user.id
			});

   //model comes with getUpdateHandler method
		var updater = newPostComment.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your comment:'
			});

		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'content'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment has been added successfully.');
				return res.redirect('/blog/post/' + locals.post.key);
			}
			next();
		});

	});

	// Render the view
	view.render('post');

};

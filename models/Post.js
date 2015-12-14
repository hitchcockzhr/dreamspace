//Keystone Generated
var async = require('async');
var keystone = require('keystone');
var Types = keystone.Field.Types;
//maybe use ASYNC so we can track the post

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	track: true,
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

// Relationship to comments
//Post.relationship({ ref: 'PostComment', refPath: 'post', path: 'comments' });

Post.schema.methods.notifyAdmins = function(callback) {
	var post = this;
	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {
		if (err) return callback(err);
		async.each(results.admins, function(admin, done) {
			new keystone.Email('admin-notification-new-post').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: post.title,
				keystoneURL: 'http://www.dreamspace.com/keystone/post/' + post.id,
				subject: 'New Post to Dreamspace'
			}, {
				to: admin,
				from: {
					name: 'Dreamspace',
					email: 'dreamspace@sydjs.com'
				}
			}, done);
		}, callback);
	}
	// Query data in parallel
	async.parallel({
		author: function(next) {
			if (!post.author) return next();
			keystone.list('User').model.findById(post.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);
};

Post.defaultSort = '-publishedDate'; //why was this not here by default?
Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();

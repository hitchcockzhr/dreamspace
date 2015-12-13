var keystone = require('keystone');
var async = require('async');
var Types = keystone.Field.Types;

/**
 * Messages Model
 * ===========
 */

var Message = new keystone.List('Message', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Message.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	content:  { type: Types.Html, wysiwyg: true, height: 400 },
	taggs: { type: Types.Relationship, ref: 'MessageTagg', many: true }
});


// This is where this model becomes unique:
// Send an email message to the Admin when a user posts something!
Message.schema.methods.notifyAdmins = function(callback) {

	var message = this;

	// Method to send the notification email after data has been loaded
	var sendEmail = function(err, results) {

		if (err) return callback(err);

		async.each(results.admins, function(admin, done) {

     // built-in Email object
			new keystone.Email('admin-notification-new-message').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				title: message.title,
				keystoneURL: 'http://www.dreamspace.com/keystone/message/' + message.id, //check after deployment
				subject: 'New Post to Shoutbox'
			}, {
				to: admin,
				from: {
					name: 'Dreamspace',
					email: 'contact@dreamspace.com'
				}
			}, done);

		}, callback);

	}

	// Query data in parallel
	// Find who author is, and who admin is
	async.parallel({
		author: function(next) {
			if (!message.author) return next();
			keystone.list('User').model.findById(message.author).exec(next);
		},
		admins: function(next) {
			keystone.list('User').model.find().where('isAdmin', true).exec(next)
		}
	}, sendEmail);

}


/**
 * Registration
 * ============
 */

Message.defaultSort = '-publishedDate';
Message.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Message.register();

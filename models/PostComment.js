//new model
var keystone = require('keystone');
var Types = keystone.Field.Types;

//Only the admin can make blog posts
//However, registered users can leave Comments
//ONLY registered users can do that
///
var PostComment = new keystone.List('PostComment', {
	nocreate: true
});

PostComment.add({
	post: { type: Types.Relationship, ref: 'Post', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});


/**
 * Registration
 * ============
 */

PostComment.defaultColumns = 'post, author, date|20%';
PostComment.register();

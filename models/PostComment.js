//new model
var keystone = require('keystone');
var Types = keystone.Field.Types;

//Only the admin can make blog posts
//However, registered users can leave Comments
//ONLY registered users can do that
///
var PostComment = new keystone.List('PostComment', {
	label: 'Comments'
	//nocreate means it cannot be made from admin ui
	//disable for now for testing purporses
});

PostComment.add({
	post: { type: Types.Relationship, ref: 'Post', index: true },
	cmState: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true }, //copied from Post model
	author: { type: Types.Relationship, ref: 'User', index: true },
	cmDate: { type: Types.Date, default: Date.now, index: true }
});

//moved
PostComment.add('Content', {
	content: { type: Types.Html, wysiwyg: true, height: 300 }
});

// Pre-Save function
// This should have been in there

/*PostComment.schema.pre('save', function(next){
//isNew and wasNew are properties that track the state of a created model
//if either cmDate or state is modified (which happens upon creation), it gets a posted cmDate assigned
console.log("saved");
	this.wasNew = this.isNew;
	if (!this.isModified('cmDate') && this.isModified('cmState') && this.cmState === 'published') {
		this.cmDate = new Date();
	}
	next();
});

//Move to middleware.js in the future
PostComment.schema.post('save', function () {
	if (!this.wasNew) return;
	if (this.author) {
		keystone.list('User').model.findById(this.author).exec(function (err, user) {
			if (user) {
				user.wasActive().save();
			}
		});
	}
});*/


/**
 * Registration
 * ============
 */

PostComment.track = true;
PostComment.defaultColumns = 'post, author, cmDate|20%';
PostComment.register();

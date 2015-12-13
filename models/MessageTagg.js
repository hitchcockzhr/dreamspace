var keystone = require('keystone');
var Types = keystone.Field.Types;


var MessageTagg = new keystone.List('MessageTagg', {
	track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

MessageTagg.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

MessageTagg.relationship({ ref: 'Message', refPath: 'taggs', path: 'messages' });


/**
 * Registration
 * ============
 */

MessageTagg.register();

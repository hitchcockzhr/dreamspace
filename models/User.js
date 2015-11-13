//Keystone Generated, edit by me
var keystone = require('keystone');
var crypto = require('crypto');
var _ = require('underscore');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

//var iterations = 10000;
//var saltLength = 64;
//var keyLength = 64;


User.add({
	//we do not need a salt...do we?
	//salt: { type: Buffer, required: true },
	//should I have a pre-save hook on roles to modify all affected colletions?
	name: { type: Types.Name, required: true, index: true }, //username
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	role: {
		type: Types.Select,
		options: 'winner, loser, authorized'
		//'required: true at some point'
	},
	createdDate: {type: Types.Datetime, index: true, default: Date.now}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }

});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


//OTHER (possible) FUNCTIONS
//toAPI() method maybe
//static findByUsername function


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();

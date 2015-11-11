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
	name: { type: Types.Name, required: true, index: true }, //username
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	createdDate: {type: Types.Datetime, index: true, default: Date.now}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }, //get rid of this in final model?
	isUser: {type: Boolean, label: 'Can access Members Area, not Keystone', index: false}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

// Provide access to Members Page
User.schema.virtual('canAccessMembers').get(function() {
	return this.isUser;
});

//OTHER FUNCTIONS

User.schema.methods.toAPI = function() {
//_id is built into your mongo document and is guaranteed to be unique
return {
    name: this.name,
    _id: this._id
};
};

//We may not need to do this
//Passwords are automatically encrypted with bcrypt
//and expose a method to compare a string to the encrypted hash
/*User.schema.methods.validatePassword = function() {
var pass = this.password;

crypto.pbkdf2(password, this.salt, iterations, keyLength, function(err, hash) {
 if(hash.toString('hex') !== pass) {
   return callback(false);
 }
 return callback(true);
});
};*/

User.schema.static('findByUsername').get(function() {
var search = {
    name: name
};

return User.model.findOne(search, callback);
});

//We probably don't need this either, I think it already generates a hash?
/*User.schema.statics('generateHash').get(function(password, callback) {
var salt = crypto.randomBytes(saltLength);

crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
 return callback(hash.toString('hex'));
});
});*/

//Another static function we may not need
/*User.schema.statics('authenticate').get(function(name, password, callback) {
return findByUsername(name, function(err, doc) {

 if(err)
 {
   return callback(err);
 }

      if(!doc) {
          return callback();
      }

      doc.validatePassword(password, function(result) {
          if(result === true) {
              return callback(null, doc);
          }

          return callback();
      });

});
});*/





/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();

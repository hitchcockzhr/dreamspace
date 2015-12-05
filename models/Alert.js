var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Alert bar model
 * ==========
 */

 var Alert = new keystone.List('Alert', {
   map: {name: 'description'},
   track: true
 });

 Alert.add({
   description: {type: String, required: true},
   createdDate: {type: Types.Date, index: true, default: Date.now},
   link: {type: Types.Url}
 });

 Alert.defaultColumns = 'description';
 Alert.register();

 module.exports = Alert;

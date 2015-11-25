//use this as a test
//credit: http://baiduhix.blogspot.co.uk/2015/02/keystone-more-deeper-authorization-role.html
//repo: wangpingxs/keystone_supperAdmin
var keystone = require('keystone');
Types = keystone.Field.Types;

var NickTest = new keystone.List('TestObj', {
  label: 'Test Object',
  path: 'testobjpath',
  singular: 'Test Objects',
  schema: {collection: 'TestObj'}
});

NickTest.add({
	title: { type: String , initial: true, required: true, index: true },
	date: { type: String },
	daycode: { type: String },
	daytheme: { type: String },
	description: { type: String },
	eventid: { type: String }
});

/**
	Registration
	============
*/

NickTest.defaultSort = '-title';
NickTest.defaultColumns = 'date|10%,daycode|10%,title|30%,daytheme|15%,description|15%,eventid|10%';
NickTest.register();

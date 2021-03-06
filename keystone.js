// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone and import libraries
var keystone = require('keystone');
var cons = require('consolidate');
var nunjucks = require('nunjucks');

keystone.init({

	'name': 'Dreamspace',
	'brand': 'Dreamspace',

	'sass': 'public',
	'static': ['public', 'data/uploads'], //for files
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'html',
	'custom engine': cons.nunjucks,

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/dreamspace',
	'session': true,
	'session store': 'connect-mongo',
	'auth': true,
	'user model': 'User'

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'posts': ['posts', 'post-categories'], //this enables the comment and category feature for the post service
	'galleries': 'galleries',
	'users': 'users'
});

keystone.start();

//THIS FILE IS ESSENTIALLY 'router.js' FOR A NORMAL MVC APP
var keystone = require('keystone');
var router = require('./router');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.lowercaseUrlMiddleware);
keystone.pre('routes', middleware.initErrorHandlers);
//keystone.pre('routes', middleware.requiresUser);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
// CONTROLLERS
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
module.exports = function(app) {

	// Views
	//app.get('/routeDefine', middleware, routes.api.file.method)
	//Don't forget POST methods:
	//app.post("/login", middleware.requiresSecure, mid.requiresLogout, controllers.Account.login);, AND middleware.requiresUser
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	//app.get('/newpage', middleware.requiresUser, routes.views.reference);

	//other stuff here?

	// add an API endpoint for signing in _before_ your protected routes
	//in routes/index.js it is routes.api.signin?
	/*app.post('/api/signin', routes.api.signin);
	app.post('/api/signout', routes.api.signout);*/


	// then bind the middleware in your routes before any paths
	// that should be protected, in this case, ALL requests to /api
	//app.all('/api*', routes.api.checkAuth);

	app.get('/*', router);


};

//THIS FILE IS ESSENTIALLY 'router.js' FOR A NORMAL MVC APP
var keystone = require('keystone');
var router = require('./router');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.lowercaseUrlMiddleware);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
// CONTROLLERS
var routes = {
  //api: importRoutes('./api'),
	views: importRoutes('./views')
  //auth: importRoutes('./auth')
};

// Setup Route Bindings
module.exports = function(app) {

	// Views
	//app.get('/routeDefine', middleware, routes.api.file.method)
	//Don't forget POST methods:
	//app.post("/login", middleware.requiresSecure, mid.requiresLogout, controllers.Account.login);, AND middleware.requiresUser

  //Website
  app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
  app.all('/gallery*', middleware.requireUser);
	app.all('/gallery', routes.views.gallery); //used to be a regular get

	//app.get('/firstsign', routes.views.signuppage); //also try firstsign
	//app.get('/newpage', middleware.requiresLogin, routes.views.reference);
	/*app.get('/newpage', middleware.roleAuth, function(req, res) {
		res.render('/newpage');
	});*/

	//other stuff here?

//Session
app.all('/signin', routes.views.signin);
app.all('/join', routes.views.join);
app.get('/signout', routes.views.signout);

//Authentication


//User? user being able to make posts may be useful


//API for the app

	app.get('/*', router);


};

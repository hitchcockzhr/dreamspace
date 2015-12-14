//THIS FILE IS ESSENTIALLY 'router.js' FOR A NORMAL MVC APP
var _ = require('underscore');
var keystone = require('keystone');
var router = require('./router');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.lowercaseUrlMiddleware);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

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
  app.get('/', routes.views.home); //no longer 'index', test new routings
	app.get('/blog/:category?', routes.views.blog);
	//app.get('/projects', routes.views.projPage);
	//app.get('/blog/post/:post', routes.views.post); //check with plog and projects
	app.get('/blog/post/:post', routes.views.post);
	//app.get('/contactme', routes.views.contactme);


	//app.get('/firstsign', routes.views.signuppage); //also try firstsign
	//app.get('/newpage', middleware.requiresLogin, routes.views.reference);
	/*app.get('/newpage', middleware.roleAuth, function(req, res) {
		res.render('/newpage');
	});*/

	//other stuff here?

//Session
//do a little breadcrumb test here
app.all('/signin', routes.views.signin);
app.all('/join', routes.views.join);
app.get('/signout', routes.views.signout);

//Authentication
// /whatever/create/message
//app.all('/textme/create/message', routes.views.createMessage);


//User? user being able to make posts may be useful
//Now let's see if this works
app.all('/gallery*', middleware.requireUser);
app.all('/gallery', routes.views.gallery); //used to be a regular get

//try this one out
app.all('/create_post', routes.views.create_post);

//API for the app

	app.get('/*', router);


};

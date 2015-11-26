var _ = require('underscore');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {

	var locals = res.locals;

//This is where you add links to other pages
//can add any page at any time
	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Blog',		key: 'blog',		href: '/blog' }
		//{ label: 'Gallery',		key: 'gallery',		href: '/gallery' }
	];

	locals.user = req.user;

//keep an eye on this for error checking
	locals.page = {
		title: 'SydJS',
		path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
	};

	//
	//get full path of requested URL
	locals.hostname = req.get('host');
  locals.base_url = req.protocol + "://" + locals.hostname;
  locals.full_url = locals.base_url + req.path;
  locals.full_path = req.path;

	// Either pull the full path slug from the path, or redirect to add a trailing '/'
	if(locals.full_path[locals.full_path.length - 1] !== '/') {
		if(locals.full_path.lastIndexOf("/keystone", 0) !== 0) {
			return res.redirect(locals.full_path + '/');
		}
	}
	locals.section_slug = locals.full_path.split("/")[1];

	next();

};

/**
	Redirect to URL's in all lowercase
*/
exports.lowercaseUrlMiddleware = function(req, res, next) {
	if(/[A-Z]/.test(req.path)) {
		return res.redirect(req.path.toLowerCase());
	}
	next();
};

/**
	Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

  res.err = function(err, title, message) {
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    });
  }

  res.notfound = function() {
    res.status(404).render('errors/404');
  }

  next();

};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;

	next();

};

//in here right now for testing
//we can control who sees which pages, outside of JUST the site admin
//however, it can not seem to pull "role" attribute into scope
exports.roleAuth = function(req, res, next) {

    if(!req.user.role === 'authorized') {
			res.redirect('/login');
		}
		next();

};

//More complicated function to go with TestObj Model
//it turns our you can define "rules" for checking people
/*var rules = [
			{path:"XxObj",roles:['aa']},
			{path:"testobjpath",roles:['cc','xx','zz']}
		];*/


/**
	Prevents people from accessing protected pages when they're not signed in. In here for now, but may not be needed in future
 */
exports.requireUser = function(req, res, next) {

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin'); //swith to custom view?
	} else {
		next();
	}

};

exports.requiresLogin = function(req, res, next) {

	if(!req.user) {
 	 res.redirect('/');
  }

  next();

};

exports.requiresLogout = function(req, res, next) {
	if(req.user) {
    res.redirect('/'); //other page
  }

  next();
};

exports.requiresSecure = function(req, res, next) {
	if(req.headers['x-forwarded-proto'] != 'https') {
    res.redirect('https://' + req.host + req.url);
  }
  next();
};

exports.bypassSecure = function(req, res, next) {
	next();
};

//exporting the functions, perhaps?
/*module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if(process.env.NODE_ENV === "production") {
  module.exports.requiresSecure = requiresSecure;
}
else {
  module.exports.requiresSecure = bypassSecure;
}*/

//This is basically, like, the User controller
var keystone = require('keystone');
var async = require('async');
var _ = require('underscore');
var User = keystone.list('User');

module.exports = function(req, res) {

   var locals = {
     form: req.body,
     newUser: false
   }

   //this function will handle signin
   var signIn = function() {
     console.log('Signing in user...');

     var onSuccess = function(user) {
       console.log('Logged in');

       //JSON API response format
       return res.apiResponse({
         success: true, //did it work?
         session: true, //is there a session running?
         date: new Date.getTime(), //when did they log in?
         userId: user.id //who is it?
       });
     }

     var onFail = function(err) {
       console.log('An error occurred');

       return res.apiResponse({
         success: false,
         session: false,
         message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
       });
     }

     //EXPLAIN this function in more detail for the documentation
     keystone.session.signin(String(locals.newUser._id), req, res, onSuccess, onFail);
   }

   //A series of async callbacks
   //invokes each callback function serially (as opposed to .parallel, going all at once)
   //one must finish before the next starts
   //So, these functions fire in a predetermined order, set by me
   async.series([

     //Validation
     function(next) {
       if (!locals.form['name.first'] || !locals.form['name.last'] || !locals.form.email || !locals.form.password) {
         console.log('All fields are required!');
         return res.apiResponse({
           success: false,
           session: false
         });
       }

       return next();
     },

     //find user by email
     function(next) {
      //these next two lines are like "find one WHERE"
       var query = User.model.findOne();
       query.where('email', locals.form.email);

      query.exec(function(err, user) {
					if (err) {
						return next({ message: 'Sorry, could not find an existing user via email.' });
					}
					if (user) {
						return next({ message: 'There is already an account with that email address, please sign-in instead.' });
					}
					return next();
				});
     },

     //Create user
     function(next) {
        var userData = {
         name: {
          first: locals.form['name.first'],
          last: locals.form['name.last']
        },
        email: locals.form.email,
        password: locals.form.password,

        state: 'enabled', //this means that a new user is enable in AdminUI

        isVerified: false
     };

     locals.newUser = new User.model(userData); //this is like making a documentation

     //save the user
     locals.newUser.save(function(err) {
       if(err) {
         return next({ message: 'Sorry, there was an error processing your account, please try again.' });
       }
       return next();
     });
   },

     //handle session
     function(next) {
        return signIn();
     }


   ], function(err) {
     if(err) {
       console.log("There is trouble signing the user in");
       return res.apiResponse({
         success: false,
         session: false,
         message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
       });
     }

   });

};

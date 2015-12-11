var keystone = require('keystone');
var _ = require('underscore');
var User = keystone.list('User');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

//made page to leave posts on
 locals.section = 'board';

 // Load the message
 view.on('init', function(next) {

   Message.model.findOne().where('author').ne(null).exec(function(err, message){
     if(err) {
       return res.err(err);
     }
     if(!message){
       return res.notfound('We could not find what you were looking for');
     }
     locals.message = message;
     next();
   });

 });

//delete message
//which is just archiving it, so its still there in db but not displayed
 view.on('get', { remove: 'message' }, function(next) {

   if(!req.user) {
     req.flash('Error: you must be signed in to remove a message');
     return next();
   }

  locals.message.state = 'archived';

  locals.message.save(function(err){
    if(err) {
      if(err.name =='CastError') {
        req.flash('error',  'the message ' + req.params.message + ' could not be found');
        return next();
      }
      return res.err(err);
    }

    if(!locals.message) {
      req.flash('error', 'the message ' + req.params.message + ' could not be found');
      return next();
    }
    if(locals.message.author.id != req.user.id && !req.user.isAdmin) {
      req.flash('You can only delete the content you made.');
      return next();
    }
    if(err){
      return res.err(err);
    }
    req.flash('success', 'Your topic has been deleted.');
		return res.redirect(req.user.url); //check this line
  });


 });

//like the maker page in domo maker
 view.render('site/message');

}

var keystone = require('keystone');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

//made page to leave posts on
 locals.section = 'forum';
 locals.title = 'Leave a message';

 view.on('message', { action: 'create-message' }, function(next) {

   // handle form
   var newMessage = new Message.model({
       author: locals.user.id,
       publishedDate: new Date()
     });

     //keystone needs an updateHandler to be called on objects
     //made outside of AdminUI
     //updateHandler usually makes a predefined message, but here, one is specified
     var updater = newMessage.getUpdateHandler(req, res, {
       errorMessage: 'There was an error creating your new message';
     });

   // automatically pubish posts by admin user
   if (locals.user.isAdmin) {
     newMessage.state = 'published';
   }

   //calling the notify admin function did not seem to work here
   //might get rid of it if we can't implement it


   //Allows for custom UI on message
   //https://gist.github.com/wuhaixing/e90b8497f925ff9c7bfc
   updater.process(req.body, {
     flashErrors: true,
     logErrors: true,
     fields: 'title, image, content'
   }, function(err) {
     if (err) {
       locals.validationErrors = err.errors;
     } else {
       newMessage.notifyAdmins();
       req.flash('success', 'Your message has been added' + ((newMessage.state == 'published')) + '.');
       return res.redirect('/'); //go home for now
     }
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
		return res.redirect(req.user.url);
  });


 });

//like the maker page in domo maker
 view.render('createMessage');

}

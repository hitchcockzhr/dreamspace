//new message form
var keystone = require('keystone');
var _ = require('underscore');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  //made page to leave posts on
  locals.section = 'gallery'; //check this
  locals.title = 'Leave a message';

  //think about the topic of the message
  //locals.form = req.body;

  view.on('message', { action: 'create-message' }, function(next) {

   // handle form
   var newMessage = new Message.model({
       author: locals.user.id,
       //state: 'published',
       publishedDate: new Date()
     });

     //keystone needs an updateHandler to be called on objects
     //made outside of AdminUI
     //put back the callback, crashes without it
     var updater = newMessage.getUpdateHandler(req, res, {
       errorMessage: 'There was an error creating your new message'
     });

   //calling the notify admin function did not seem to work here
   //might get rid of it if we can't implement it


   //Allows for custom UI on message
   //https://gist.github.com/wuhaixing/e90b8497f925ff9c7bfc
   updater.process(req.body, {
     flashErrors: true,
     logErrors: true,
     fields: 'title, content'
   }, function(err) {
     if (err) {
       locals.validationErrors = err.errors;
       //return next(); //nothing else to go on next
     } else {
       newMessage.notifyAdmins();
       req.flash('success', 'Your message has been added' + ((newMessage.state == 'published')) + '.');
       return res.redirect('/board/message/' + newMessage.slug); //slug or key?
     }

     next();

   });


  });

  view.render('site/createMessage');

};

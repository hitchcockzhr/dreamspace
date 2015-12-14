//new message form
var keystone = require('keystone');
var Post = keystone.list('Post');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  //made page to leave posts on
  locals.section = 'new-post'; //check this
  locals.title = 'Make a post';

  //think about the topic of the message
  //locals.form = req.body;

  view.on('post', { action: 'create-post' }, function(next) {

   // handle form
   var newPost = new Post.model({
       author: locals.user.id,
       state: 'published',
       publishedDate: new Date()
     });

     //keystone needs an updateHandler to be called on objects
     //made outside of AdminUI
     //put back the callback, crashes without it
     var updater = newPost.getUpdateHandler(req, res, {
       errorMessage: 'There was an error creating your new message'
     });

   //calling the notify admin function did not seem to work here
   //might get rid of it if we can't implement it


   //Allows for custom UI on message
   //https://gist.github.com/wuhaixing/e90b8497f925ff9c7bfc
   updater.process(req.body, {
     flashErrors: true,
     logErrors: true,
     fields: 'title, image, content.extended'
   }, function(err) {
     if (err) {
       locals.validationErrors = err.errors;
     } else {
       //newMessage.notifyAdmins(); //this may not work for the time being
       //req.flash('success', 'Your message has been added' + ((newPost.state == 'published')) + '.');
       req.flash('Success!!!');
       return res.redirect('/blog/post/' + newPost.slug); //slug or key?
     }

     next();

   });


  });

  view.render('create_post');

};

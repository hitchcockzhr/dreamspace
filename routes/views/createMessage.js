var keystone = require('keystone');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

 locals.section = 'me';
 locals.title = 'Leave a message';

 view.on('message', { action: 'create-message' }, function(next) {

   // handle form
   var newMessage = new Message.model({
       author: locals.user.id,
       publishedDate: new Date()
     });


   // automatically pubish posts by admin user
   if (locals.user.isAdmin) {
     newMessage.state = 'published';
   }

   //calling the notify admin function did not seem to work here
   //might get rid of it if we can't implement it

   /*newMessage.notifyAdmins();
   req.flash('success', 'Your post has been added' + ((newMessage.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
   return res.redirect(page to redirect to, like /maker);*/

 });

 view.render('createMessage');

}

//I need to get my shit together
var keystone = require('keystone');
var _ = require('underscore');
var async = require('async');
var Message = keystone.list('Message');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'board';

  //Let's query those MessageSSSSSSSSSSSSSS!
  //Paginate function displays content with minimal styling
  var messageQuery = Message.paginate({
    page: req.query.page || 1,
    perPage: 10,
    maxPages: 5
  }).where('state', 'published').where('author').ne(null);

// Run the message query on 'render'
//split up the code and make it neater than how
//it is presented in the default blog
  view.on('render', function(next){
    messageQuery.exec(function(err, messages){
      if(err){
        res.err('Sorry, there was an error loading messages');
      }
      else{
        locals.messages = messages;
        next();
      }
    });

  });

  view.render('board');

}

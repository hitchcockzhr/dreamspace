var keystone = require('keystone');
_ = require('underscore');

module.exports = function(req, res) {

//variable for rendering the view
//and setting local variables
var view = new keystone.View(req, res);
var locals = res.locals;

//locals.section is used to set the currently selected
//item in the header navigation
locals.data = {};

//Load the view
view.on('init', function(next) {

var q = keystone.list('Reference').model.findOne({
  slug: req.params.slug
}).populate('related pages');

q.exec(function(err, result) {
   if(!result) {
   return res.notFound();
   }

});

});

view.render('reference');

};

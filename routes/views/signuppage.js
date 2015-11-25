var keystone = require('Keystone');

exports = module.exports = function(req, res) {

var view = new Keystone.View(req, res);
/*var locals = res.locals;
locals.data = {};

view.on('init', function(next) {
   locals.data.page = req.query.page;
   next();
});*/

view.render('signup_page');

};

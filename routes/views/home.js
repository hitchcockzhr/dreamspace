var keystone = require('keystone');
//might import npm moment for the calendar (stretch goals)

module.exports = function(req, res) {

var view = new keystone.View(req, res);
var locals = res.locals;

view.render('home');

}

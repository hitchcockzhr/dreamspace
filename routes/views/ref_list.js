//One double chili fries coming up
var keystone = require('keystone');
var Reference = keystone.list('Reference');
var _ = require('underscore');

module.exports = function(req, res) {

var view = new keystone.View(req, res);
var locals = res.locals;

locals.data = {
  page: req.query.page || 1; //maybe make it one page, there won't be that many people
};

locals.query = req.query;

//how to sort

view.on('init', function(next) {
  //stubbed 
});

};

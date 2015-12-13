//I need to get my shit together
var keystone = require('keystone');
var async = require('async');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'board';
  locals.page.title = 'Shoutbox';

  locals.filters = {
    tagg: req.params.tagg
  };

  locals.data = {
    messages: [],
    taggs: []
  };

// Start by loading the tags
view.on('init', function(next) {

  keystone.list('MessageTagg').model.find().sort('name').exec(function(err, results) {

    if (err || !results.length) {
      return next(err);
    }

//It cannot be called TAG because that is a real syntax word
//So we have to take creative liberties
    locals.data.taggs = results;

    // Load the counts for each category
    async.each(locals.data.taggs, function(tagg, next) {

      keystone.list('Message').model.count().where('tagg').in([tagg.id]).exec(function(err, count) {
        tagg.messageCount = count;
        next(err);
      });

    }, function(err) {
      next(err);
    });

  });

});

// Load the current tag filter
view.on('init', function(next) {

  if (req.params.tagg) {
    keystone.list('MessageTagg').model.findOne({ key: locals.filters.tagg }).exec(function(err, result) {
      locals.data.tagg = result;
      next(err);
    });
  } else {
    next();
  }

});

  // Load the messages
	view.on('init', function(next) {

		var q = keystone.list('Message').model.find().where('state', 'published').sort('-publishedDate').populate('author taggs');

    if (locals.data.tagg) {
			q.where('taggs').in([locals.data.taggs]);
		}

		q.exec(function(err, results) {
			locals.data.messages = results;
			next(err);
		});

	});

  view.render('board');

}

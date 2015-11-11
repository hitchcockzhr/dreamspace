var keystone = require('keystone'),
	async = require('async');


//exports = module.exports = {};
module.exports.fetchContentBlocks = function() {
	var result = arguments[0];
	var next, fieldName;
	if (arguments.length === 3) {
		fieldName = arguments[1];
		next = arguments[2];
	} else {
		fieldName = 'blocks';
		next = arguments[1];
	}

	// Handle Relationships
	//
	function populateRelated(path) {
		return function(callback) {
			keystone.list('BasePage').model.populate(result[fieldName], { path: path }).then(function() {
				callback();
			});
		};
	}

//do we need all of these yet?
async.parallel([
  populateRelated('mainRelated'),
  populateRelated('leftRelated'),
  populateRelated('rightRelated'),
  populateRelated('centerRelated'),
  populateRelated('asideRelated')
], function(err) {
console.log("It didn't work.");

});

};

var keystone = require('keystone');
var Types = keystone.Field.Types;
var BasePage = require('./BasePage');


var SignupPage = new keystone.List('SignupPage', {inherits: BasePage});
SignupPage.register();

module.exports = SignupPage;

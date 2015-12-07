var keystone = require('keystone');
var BasePage = require('./BasePage');
var _ = require('underscore');
var Types = keystone.Field.Types;

/**
 * Homepage Model
 * ==========
 */

 //instantiate new model
  var Home = new keystone.List('Home', {
  inherits: BasePage
  });

  Home.add('Intro', {
    intro: {
      title: {type: Types.Text},
      videoEmbed: {type: Types.Html},
      image: {
        collapse: true, //native support for collapsable item
        type: Types.LocalFile,
        dest: 'data/uploads/static/homeIntroImage'
      },
    linkText: {type: Types.Text},
    link: {type: Types.Url},
    description: {type: Types.Text}
  }
});

Home.schema.statics.view_name = 'home';
Home.register();

module.exports = Home;

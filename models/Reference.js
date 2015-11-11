var keystone = require('keystone');
BasePage = require('./BasePage');
_ = require('underscore');
Types = keystone.Field.Types;

/**
 * Reference Model
 * ==========
 */

//instantiate new model
 var Reference = new keystone.List('Reference', {
 inherits: BasePage
 });

 Reference.add({
 title: {type: String, required: true, initial: true, label: "Reference Name"}
 });

 Reference.add('Hero', {
 heroImage: {type: Types.CloudinaryImage},
 heroJob: {type: String} //should it be required?
 });

// Keystone equivalent of virtual methods
 Reference.schema.virtual('heroImgSrc').get(function() {
   if(!this.heroImage.exists) return;
   return this._.heroImage.limit(1440, 900); //size limit for image
 });

 Reference.add('Details', {
 gender: {type: Types.Select, options: ['male', 'female']},
 photo: {type: Types.CloudinaryImage},
 history: {type: Types.Select, options: ['past', 'current', 'present']}, //past or present employer(s)
 birthdate: {type: Types.Date, yearRange: [1900, 2015]}
 });

 //more photo code
 Reference.schema.virtual('photoSrc').get(function() {
   if(!this.photo.exists) return;
   return this._.photo.limit(1440, 900); //size limit for image
 });

 Reference.add('Blurb', {
//"What You See Is What You Get"
//Allows us to see result of HTML element before it is created
//Including text indentation, font size, font styles, etc.
   Story: {type: Types.Html, wysiwyg: true}
 });

 //For Team Members:
 //It will refer to pages of projects that we worked on together
 Reference.add('Related Pages', {
   related: {
     label: 'Related Pages',
     collapse: true,
     type: Types.Relationship,
     ref: BasePage,
     many: true
   }
 });



 Reference.register();

 //save the document
 Reference.schema.pre('save', function(next) {
   var thisPage = this;
   BasePage.model.findOne({slug: 'reference'}, function(err, parentNode) {
     if(parentNode) {
       thisPage.fullPath = parentNode.fullPath + thisPage.slug + '/';
     }
     else {
       thisPage.fullPath = '/' + thisPage.slug + '/';
     }
   });
 });

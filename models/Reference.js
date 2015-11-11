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

 //

 Reference.add('Details', {
 gender: {type: Types.Select, options: ['male', 'female']},
 photo: {type: Types.CloudinaryImage},
 history: {type: Types.Select, options: ['past', 'current', 'present']}, //past or present employer(s)
 birthdate: {type: Types.Date, yearRange: [1900, 2015]}
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

 //perhaps some methods, later on

var keystone = require('keystone');
var Types = keystone.Field.Types;

//Model for Projects
//Project is like a post inserted into the blog

var Project = new keystone.List('Project', {
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'title', unique: true}
});

Project.add({
  title: {type: String, required: true},
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  image: {
    collapse: true,
    type: Types.LocalFile,
    dest: 'data/uploads/static/projectImages'
  },
  description: {
    type: Types.Html,
    wysiwyg: true,
    height: 400
  },
  vidText: {type: Types.Text},
  vidLink: {type: Types.Url}
});

Project.add(
    'Partners',
    {
        partners: { type: Types.Relationship, ref: 'Reference', many: true } //accepts references
    }
);

//think maybe about the default columns
Project.register();

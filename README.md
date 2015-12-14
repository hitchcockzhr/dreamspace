# dreamspace
Multiuser Portfolio website, powered by Keystone JS

#  How to run:
1. Make sure NodeJS and MongoDB are installed
2. Download zip or git clone this repo
3. Type this into your terminal (anywhere) to get Keystone on your machine:
npm install -g generator-keystone
4. Now just do a simple npm install in the root directory
5. In the root folder, create a .env file with the following information:
COOKIE_SECRET=wTUnbxw:FT%!vMBA.6m/kfmX(Ena5!2iJeTS)8gH^4VGUd%fx[vQV@+e,;2]yATq
CLOUDINARY_URL=cloudinary://936669194473599:sEYtaWP3amXS3_FsXDTZgnuvZ2Q@db1wgqtps
6. To run: nodemon keystone.js (or node keystone for those without nodemon)
7. Also check out the Heroku link: http://portfolio-ni.herokuapp.com/

#  How does it work?
Keystone JS is a Model-View-Controller framework that is open source and very powerful. When running the generator from the terminal, 
you automatically get an index page, as well as a default Blog page and the model, view, controllers for a Post. A project directory would 
look like the Keystone.png image in the root folder.
Content Blocks were added to have nicely formatted content across all pages. They run on the Mongoose Nested Set plugin. This allows 
the models to have a nested set pattern. Multiple content blocks can be added to a page. There are several types, defined in the same 
file for neatness.
Models can also take relationships to other models. So, a Post could have Comments and Categories, a Page can have content blocks, ect. 
Some models need to take other models in, because they will be displayed together on the front-end.

#  Keystone lists are mongoose schemas
That pharase is pretty self-explanatory. They have all the same methods, too.

#  What about controllers?
Controllers are in routes/views directory. These are known as "Express Controllers", which exist only to render a view. However, they 
can still take in whatever methods you want. Sometimes it is just better to have your controllers methods in the files for the models.

#  Cool stuff I used for the project
1. Nodemon to watch changes to Javascript
2. Grunt to watch changes to .SASS styles
3. Npm Moment package for the Alert Bar
3. Nunjucks + HTML for templating
4. Bootstrap for forms and some styling
5. The Async library of methods
6. .SASS styles

#  Post-Mortem
1. Tride Post Comments (as well as delete) and failed. The comments crashed the site. The code for the models (and code in routes/views/post) is still there to return to one day.
2. Page inheritance did not work as planned (e.g. Homepage inheriting from Basepage). Home attributes won't render for some reason.
3. Send emails to admin when user makes content: commented out (check Post model). Blog would crash upon clicking on a post.
4. Multiuser components took longer than expected. The framework does not natively support user content made from the front-end.
5. Because of this, I tried to add too many things at the last minute, personally feeling the site was too small.
6. A lot of hours went into trying various methods for some functions, and reading up on Mongoose. I feel that I took to long to figure some stuff out
7. Original project definition, which changed a little over time: http://people.rit.edu/nai7804/project_REDO/design.html
8. If you read this far down, you get a cookie :)

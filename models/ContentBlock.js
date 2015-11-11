var keystone = require('keystone');
var Types = keystone.Field.Types;
var debug = require('debug')('dreamspace:ContentBlock'); //npm debug utility. Recommended, but I've yet to use it

function camelize(str) {
    // Convert String to camelCase
    // inspired by: https://gist.github.com/vjt/827679
    // regex matches any word, or letter A-Z, or whitespace/punctuation (\b)
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

//allows us to build content inside the content block
//takes in a Mongoose Schema type, and the name to display in Admin UI
//buidling types of content is similar to building models
function buildContentSection(listType, sectionName) {
    var contentKey = camelize(sectionName); //where camelization comes in handy
    var contentSection = {};
    contentSection[contentKey + 'Image'] =  {
        label: 'Image',
        collapse: true,
        type: Types.LocalFile,
        //type: Types.CloudinaryImages,
        dest: 'data/uploads/static',
        //folder: 'data/uploads/static',
        prefix: '/static'
    };
    contentSection[contentKey + 'ImageAlt'] =  {
        label: 'Image Alt Text',
        collapse: true,
        type: String,
    };
    contentSection[contentKey + 'Youtube'] = {
        label: 'Youtube Link',
        type: Types.Text,
        collapse: true
    };
    contentSection[contentKey + 'Embed'] = {
        label: 'Embed Code',
        type: Types.Html,
        collapse: true
    };
    contentSection[contentKey + 'Content'] = {
        label: 'Content',
        type: Types.Html,
        collapse: true,
        wysiwyg: true //What You See is What You Get Generator, lets us edit HTML content section
    };
    contentSection[contentKey + 'ButtonText'] = {
        label: 'Button Text',
        collapse: true,
        type: String
    };
    contentSection[contentKey + 'ButtonLink'] = {
        label: 'Button Link',
        collapse: true,
        type: String
    };
    contentSection[contentKey + 'Related'] = {
        label: 'Related Pages',
        collapse: true,
        type: Types.Relationship,
        ref: 'BasePage',
        many: true
    };
    listType.add(sectionName, contentSection);

//do we or do we not have the right image?
//doesn't work quite right
    listType.schema.virtual(contentKey + 'ImageSrc').get(function() {
      if (!this[contentKey + 'Image']) return;
      return this[contentKey + 'Image'].href;
    });

//builds url for YouTube video
//instead of using services like Embed.ly
    listType.schema.virtual(contentKey + 'YoutubeId').get(function() {
        if (!this[contentKey + 'Youtube']) return;

        var urlParts = this[contentKey + 'Youtube'].split('v=');
        if(urlParts.length <= 1) return;

        var video_id = urlParts[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    });
}

/**
 * Actual ContentBlock Model
 * ==========
 */
const ContentBlock = new keystone.List('ContentBlock', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true },
});
ContentBlock.add({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    slug: {
      type: String
    },
    author: {
        type: Types.Relationship,
        ref: 'User',
        index: true
    },
    inPageNav: {
      type: Types.Boolean,
      default: false

    }
});

ContentBlock.defaultColumns = 'name';
ContentBlock.register();

//In the same file, we can define different kinds of content blocks
//This reduces clutter and the need for multiple files
//To build content, pass in the block and what you want it to be called
var FullWidth = new keystone.List('FullWidth', { inherits: ContentBlock });
buildContentSection(FullWidth, 'Main');
FullWidth.register();

// Three Column layout
var ThreeCol = new keystone.List('ThreeCol', { inherits: ContentBlock });
buildContentSection(ThreeCol, 'Left');
buildContentSection(ThreeCol, 'Center');
buildContentSection(ThreeCol, 'Right');
ThreeCol.register();

// Left Aligned
var LeftAside = new keystone.List('LeftAside', { inherits: ContentBlock });
LeftAside.add({
    verticalCenter: {
        label: 'Align Vertically',
        type: Types.Boolean
    }
});
buildContentSection(LeftAside, 'Aside');
buildContentSection(LeftAside, 'Main');
LeftAside.register();

// Right Aside
var RightAside = new keystone.List('RightAside', { inherits: ContentBlock });
RightAside.add({
    verticalCenter: {
        label: 'Align Vertically',
        type: Types.Boolean
    }
});
buildContentSection(RightAside, 'Main');
buildContentSection(RightAside, 'Aside');
RightAside.register();

module.exports = ContentBlock;

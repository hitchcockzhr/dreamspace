var keystone = require('keystone');
var Types = keystone.Field.Types;
var debug = require('debug')('dreamspace:ContentBlock');

function camelize(str) {
    // Convert String to camelCase
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function buildContentSection(listType, sectionName) {
    var contentKey = camelize(sectionName);
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
        wysiwyg: true
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

    listType.schema.virtual(contentKey + 'ImageSrc').get(function() {
      if (!this[contentKey + 'Image']) return;
      return this[contentKey + 'Image'].href;
    });

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
 * ContentBlock Model
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

var FullWidth = new keystone.List('FullWidth', { inherits: ContentBlock });
buildContentSection(FullWidth, 'Main');
FullWidth.register();

var ThreeCol = new keystone.List('ThreeCol', { inherits: ContentBlock });
buildContentSection(ThreeCol, 'Left');
buildContentSection(ThreeCol, 'Center');
buildContentSection(ThreeCol, 'Right');
ThreeCol.register();

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

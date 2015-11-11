var keystone = require('keystone');
var ContentBlock = require('./ContentBlock');
var Types = keystone.Field.Types;


/**
 * Hero Model
 * =============
 */
const HeroContentBlock = new keystone.List('HeroContentBlock', { inherits: ContentBlock });

HeroContentBlock.add({
    description: { type: Types.Text },
    buttonText: { type: Types.Text },
    buttonLink: { type: Types.Text },
});

HeroContentBlock.register();

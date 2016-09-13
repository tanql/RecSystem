var Backbone = require('backbone');
var $ = require('jquery');
window.jQuery = $;
window.$ = $;
var dotdotdot = require('dotdotdot');

var garmentTemplate = require('./garment.hbs');

var GarmentView = Backbone.View.extend({
    template: garmentTemplate,
    tagName: 'div',
    className: 'garment-outer',

    render: function () {
        var templateObject = this.model.toJSON();
        var htmlOutput = this.template(templateObject);
        this.$el.html(htmlOutput);

        this.$('.garment-text .short').dotdotdot({
            ellipsis	: '... ',   /*	The text to add as ellipsis. */
            wrap		: 'letter', /*	How to cut off the text/html: 'word'/'letter'/'children' */
            fallbackToLetter: true, /*	Wrap-option fallback to 'letter' for long words */
            after		: ".read-more", /*	jQuery-selector for the element to keep and put after the ellipsis. */
            watch		: true, /*	Whether to update the ellipsis: true/'window' */
            height		: null, /*	Optionally set a max-height, can be a number or function. If null, the height will be measured. */
            tolerance	: 0,    /*	Deviation for the height-option. */
            callback	: function( isTruncated, orgContent ) {}, /* Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string). */
            lastCharacter	:
            {
                remove		: [ ' ', ',', ';', '.', '!', '?' ], /*	Remove these characters from the end of the truncated text. */
                noEllipsis	: [] /*	Don't add an ellipsis if this array contains the last character of the truncated text. */
            }
        });

        return this;
    },
    events: {
        'click .read-more': 'readMore'
    },
    readMore: function () {
        this.$('.garment-text').addClass('show-long');
    }
});

module.exports = GarmentView;

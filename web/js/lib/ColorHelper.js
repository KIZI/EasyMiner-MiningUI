/**
 * Class ColorHelper
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var ColorHelper = new Class({

    $attributesBackgroundColor: '#FFF',
    $attributesHighlightBackgroundColor: '#9DE045',
    $attributesEnterBackgroundColor: '#DEEBCD',

    $cedentBackgroundColor: '#FFF',
    $cedentBorderColor: '#FFF',
    $cedentHighlightBackgroundColor: '#9DE045',
    $cedentHighlightBorderColor: '#000',
    $cedentEnterBackgroundColor: '#DEEBCD',

    getAttributesBackgroundColor: function() {
        return this.$attributesBackgroundColor;
    },

    getAttributesHighlightBackgroundColor: function() {
        return this.$attributesHighlightBackgroundColor;
    },

    getAttributesEnterBackgroundColor: function() {
        return this.$attributesEnterBackgroundColor;
    },

    getCedentBackgroundColor: function() {
        return this.$cedentBackgroundColor;
    },

    getCedentBorderColor: function() {
        return this.$cedentBorderColor;
    },

    getCedentHighlightBackgroundColor: function() {
        return this.$cedentHighlightBackgroundColor;
    },

    getCedentHighlightBorderColor: function() {
        return this.$cedentHighlightBorderColor;
    },

    getCedentEnterBackgroundColor: function() {
        return this.$cedentEnterBackgroundColor;
    }

});
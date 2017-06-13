/**
 * Class ElementSizeMeter
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var ElementSizeMeter = new Class({

    getWidth: function(target) {
        var width = 0;
        var targets = Array.from(target);
        targets.each(function(element) {
            var elementWidth = element.getSize().x;
            var elementMarginWidth = $('navigation').getStyle('margin-right').replace('px', '').toInt() + $('navigation').getStyle('margin-left').replace('px', '').toInt();
            width += (elementWidth + elementMarginWidth);
        });

        return width;
    },

    computeBorderlessWidth: function(elements) {
        var totalWidth = 0;
        var list = Array.from(elements);
        var cssList = [
            'margin-left', 'margin-right', 'width', 'padding-left', 'padding-right'
        ];

        list.each(function(e) {
            cssList.each(function(c) {
                totalWidth += parseInt($(e).getStyle(c));
            });
        });

        return totalWidth;
    }

});
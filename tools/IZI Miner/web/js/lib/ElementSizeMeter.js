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
    }

});
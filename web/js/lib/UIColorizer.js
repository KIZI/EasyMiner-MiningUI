var UIColorizer = new Class({

    $backgroundTweenDuration: 150,

    tween: function(element, value, property, duration) {
        duration = duration || this.$backgroundTweenDuration;
        property = property || 'background-color';

        var elements = Array.from(element);
        elements.each(function(element) {
            new Fx.Tween(element, {duration: duration}).start(property, value);
        });
    }
});
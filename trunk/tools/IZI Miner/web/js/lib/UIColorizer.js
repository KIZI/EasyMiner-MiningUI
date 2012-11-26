var UIColorizer = new Class({

    tween: function(element, property, value, duration) {
        new Fx.Tween(element, {duration: duration}).start(property, value);
    },

    // TODO remove - obsolete
	dragEnter: function (element) {
        element.tween('background-color', '#98B5C1');
	},

    // TODO remove - obsolete
	dragLeave: function (element) {
        element.tween('background-color', '#FFF');
	},

    // TODO remove - obsolete
	dragDrop: function (element) {
        element.highlight('#7389AE');
	}
	
});
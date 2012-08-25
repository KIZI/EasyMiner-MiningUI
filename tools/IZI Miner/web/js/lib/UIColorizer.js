var UIColorizer = new Class({
	
	dragEnter: function (element) {
        element.tween('background-color', '#98B5C1');
	},
	
	dragLeave: function (element) {
        element.tween('background-color', '#FFF');
	},
	
	dragDrop: function (element) {
        element.highlight('#7389AE');
	}
	
});
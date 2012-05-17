var DataDescription = new Class({
	
	attributes: [],
	
	initialize: function (data) {
		this.parseAttributes(data);
	},
	
	parseAttributes: function (attributes) {
		Object.each(attributes, function (value, name) {
			var attribute = new Attribute(name, value.choices, new StringHelper());
			this.attributes.push(attribute);
		}.bind(this));
	},
	
	getAttributeByName: function (name) {
		var retval = null;
		Array.each(this.attributes, function(attr) {
			if (attr.getName() === name) {
				retval = attr;
			}
		}.bind(this));
		
		return retval;
	},
	
	getAttributeByPos: function (pos) {
		return this.attributes[pos];
	},
	
	getAttributes: function () {
		return this.attributes;
	},
	
	setAttributes: function(attributes) {
		this.attributes = attributes;
	},
	
	countAttributes: function () {
		return this.attributes.length;
	},
	
	sortAttributes: function (positions) {
		var attributes = [];
		Array.each(positions, function (pos) {
			var attr = this.getAttributeByPos(pos);
			attributes.push(attr);
		}.bind(this));
		
		this.attributes = attributes;
	}
	
});
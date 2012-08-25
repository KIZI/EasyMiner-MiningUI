/*global Class: false, Field: false */ 

var FieldFR = new Class({
	Extends: Field,
	
	sign: true,
	marked: false,

	initialize: function () {
		this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
	},
	
	hasPositiveSign: function () {
		return this.sign;
	},
	
	setNegativeSign: function () {
		this.sign = false;
	},
	
	serialize: function () {
		var serialized = {};
		serialized.name = this.getAttributeName();
		serialized.type = 'attr';
		serialized.category = this.type;
		serialized.catref = this.category;

		return serialized;
	}
	
});
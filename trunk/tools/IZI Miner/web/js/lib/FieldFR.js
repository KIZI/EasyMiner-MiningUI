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
		// TODO XQuery - decompozice???

		return serialized;
	},
	
	toStringAR: function() {
		var str = '';
		if (!this.hasPositiveSign()) {
			str += '<span class="field-sign negative"></span>';
		}
		
		str += this.getAttributeName() + '<span class="coefficient">';
		if (this.category.length > 1) {
			str += '(';
		}
		
		Array.each(this.category, function (cat, key) {
			if (this.category.length === 1 && !cat.contains('(') && !cat.contains(')')) {
				str += '(';
			}
			str += cat;
			if (this.category.length === 1 && !cat.contains('(') && !cat.contains(')')) {
				str += ')';
			}
			
			if (this.category.length !== (key + 1)) {
				str += ', ';
			}
		}.bind(this));
		
		if (this.category.length > 1) {
			str += ')';
		}
		
		str += '</span>';
		
		return str;
	}
	
});
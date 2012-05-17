/*global Class: false, Field: false */ 

var FieldAR = new Class({
	Extends: Field,
	
	sign: true,
	marked: false,

	initialize: function () {
		if (arguments.length === 5) {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		} else if (arguments.length === 6) {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		} else {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3]);
		}
	},
	
	getCSSID: function () {
		return 'field-' + this.id;
	},
	
	getCSSDragID: function () {
		return 'field-drag-' + this.id;
	},
	
	getCSSRemoveID: function () {
		return 'remove-field-' + this.id;
	},
	
	getAddCoefficientCSSID: function () {
		return 'add-coefficient-' + this.id;
	},
	
	getEditCoefficientCSSID: function () {
		return 'edit-coefficient-' + this.id;
	},
	
	getCSSChangeSignID: function () {
		return 'change-field-sign-' + this.id;
	},
	
	getCSSMarkID: function () {
		return this.isMarked() === true ?  'marked-field-' + this.id : 'mark-field-' + this.id;
	},
	
	getSign: function () {
		return (this.sign === true ? 'Positive' : 'Negative');
	},
	
	changeSign: function () {
		this.sign = !this.sign;
	},
	
	hasPositiveSign: function () {
		return this.sign;
	},
	
	isMarked: function () {
		return this.marked;
	},
	
	mark: function () {
		this.marked = true;
	},
	
	unMark: function () {
		this.marked = false;
	},
	
	changeMark: function () {
		this.marked = !this.marked;
	},
	
	serialize: function () {
		var serialized = {};
		serialized.name = this.getAttributeName();
		serialized.type = 'attr';
		serialized.category = this.type;
		if (this.type === 'One category') {
			serialized.fields = [{name: 'category', value: this.category}];
		} else if (this.type) {
			serialized.fields = [{name: 'minLength', value: this.minimalLength},
			                     {name: 'maxLength', value: this.maximalLength}];
		}

		return serialized;
	},
	
	toString: function () {
		var string = '';
		if (this.hasPositiveSign() === true) { 
			string += '<span class="field-sign positive">'; 
		} else {
			string += '<span class="field-sign negative">';
		}
		
		if (this.type === null) {
			string += this.getAttributeName() + '</span>';
			return string;
		}
		
		if (this.type === 'One category') {
			string += this.getAttributeName() + ' (' + this.category + ')';
		} else {
			string += this.getAttributeName() + ' (' + this.type + ' ' + this.minimalLength + '-' + this.maximalLength + ')';
		}
		string += '</span>';
		
		return string
	},

	toStringAR: function() {
		if (this.type === 'One category') {
			return this.getAttributeName() + '<span class="coefficient">' + (!this.category.contains('(') && !this.category.contains(')') ? '(' : '') + this.category + (!this.category.contains('(') && !this.category.contains(')') ? ')' : '') + '</span>';
		} else {
			return this.getAttributeName() + '<span class="coefficient">(' + ((this.type === 'Subset' && this.minimalLength == 1 && this.maximalLength == 1) ? '*' : '*' + this.type + ' ' + this.minimalLength + '-' + this.maximalLength) + ')</span>';
		}
	}
	
});
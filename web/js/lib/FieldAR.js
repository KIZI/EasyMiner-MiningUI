/*global Class: false, Field: false */
/**
 * Class FieldAR
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var FieldAR = new Class({
	Extends: Field,
	
	marked: false,

	initialize: function () {
		if (arguments.length === 6) {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
		} else if (arguments.length === 7) {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
		} else {
			this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
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
	}
	
});
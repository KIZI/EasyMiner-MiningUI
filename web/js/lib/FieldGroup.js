/*global Class: false */
/**
 * Class FieldGroup
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var FieldGroup = new Class({

	id: null,
	name: '',
	localizedName: '',
	explanation: '',
	fields: {},
	childGroups: [],
	connective: '',
	isRoot: null,

	initialize: function (id, name, localizedName, explanation, childGroups, connective, isRoot) {
		this.id = id;
		this.name = name;
		this.localizedName = localizedName;
		this.explanation = explanation;
		this.childGroups = childGroups;
		this.connective = connective;
		this.isRoot = isRoot;
	},
	
	getId: function () {
		return this.id;
	},
	
	getName: function () {
		return this.name;
	},
	
	getLocalizedName: function () {
		if (this.localizedName !== null && this.localizedName !== undefined) {
			return this.localizedName;
		}
		
		return this.name;
	},
	
	getExplanation: function () {
		return this.explanation;
	},
	
	addField: function (key, field) {
		this.fields[key] = field;
	},
	
	getField: function (key) {
		if (this.fields[key] !== undefined) {
			return this.fields[key];
		}
		
		return null;
	},
	
	getFields: function () {
		return this.fields;
	},
	
	getChildGroups: function () {
		return this.childGroups;
	},
	
	getConnective: function () {
		return this.connective;
	},
	
	getIsRoot: function () {
		return this.isRoot;
	},
	
	getCSSID: function () {
		return 'fg-' + this.id;
	},
	
	getCSSNameID: function () {
		return 'fg-' + this.id + '-name';
	}

});
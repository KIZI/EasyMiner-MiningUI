/*global Class: false */ 

var Attribute = new Class({

	name: '',
	choices: [],
	stringHelper: null,
	value: null,

	initialize: function (name, choices, stringHelper, value) {
		this.name = name;
		this.choices = choices;
		this.stringHelper = stringHelper;
		this.value = value || 0;
	},
	
	getName: function () {
		return this.name;
	},
	
	getNormalizedName: function () {
		return this.stringHelper.normalizeString(this.name);
	},
	
	getChoices: function () {
		return this.choices;
	},
	
	getValue: function () {
		return this.value;
	},
	
	setValue: function (value) {
		this.value = value;
	},
	
	isRecommended: function () {
		return (this.value >= 0.75);
	},
	
	isPartiallyRecommended: function () {
		return (this.value >= 0.3);
	},
	
	/* misc */
	getCSSID: function () {
		return 'attribute-nav-' + this.getNormalizedName();
	}

});
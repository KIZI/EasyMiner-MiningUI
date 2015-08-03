/*global Class: false */ 

var Attribute = new Class({

	name: '',
	choices: [],
	stringHelper: null,
	value: null,
	hidden: false,

	initialize: function (name, choices, stringHelper, hidden, value) {
		this.name = name;
		this.choices = choices;
		this.stringHelper = stringHelper;
		this.hidden = hidden;
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

    getNumChoices: function() {
        return this.getChoices().length;
    },

    getStringHelper: function() {
        return this.stringHelper;
    },
	
	getValue: function () {
		return this.value;
	},
	
	setValue: function (value) {
		this.value = value;
	},

	isHidden: function () {
		return this.hidden;
	},

	setHidden: function (hidden) {
		this.hidden = hidden;
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
	},

    getCSSAddID: function() {
        return 'attribute-add-' + this.getNormalizedName();
    },

    getCSSEditID: function () {
        return 'attribute-edit-' + this.getNormalizedName();
    },

    getCSSRemoveID: function() {
        return 'attribute-remove-' + this.getNormalizedName();
    },

    getCSSShowHistogramID: function () {
        return 'attribute-show-histogram-' + this.getNormalizedName();
    },

    load: function(obj) {
        this.name = obj.name;
        this.stringHelper = this.stringHelper || new StringHelper();
        this.value = obj.value;
    }

});
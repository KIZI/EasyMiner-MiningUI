/*global Class: false */ 

var InterestMeasure = new Class({

	name: '',
	localizedName: '',
	explanation: '',
	thresholdType: '',
	compareType: '',
	fields: [],
	stringHelper: null,

	initialize: function (name, localizedName, explanation, thresholdType, compareType, fields, stringHelper) {
		this.name = name;
		this.localizedName = localizedName;
		this.explanation = explanation;
		this.thresholdType = thresholdType;
		this.compareType = compareType;
		this.fields = fields;
		this.stringHelper = stringHelper;
	},
	
	getName: function () {
		return this.name;
	},
	
	getLocalizedName: function () {
		if (this.localizedName.length !== 0) {
			return this.localizedName;
		}
		
		return this.name;
	},
	
	getNormalizedName: function () {
		return this.stringHelper.normalizeString(this.name);
	},
	
	getExplanation: function () {
		return this.explanation;
	},
	
	getThresholdType: function () {
		return this.thresholdType;
	},
	
	getCompareType: function () {
		return this.compareType;
	},
	
	getFields: function () {
		return this.fields;
	},
	
	getStringHelper: function () {
		return this.stringHelper;
	},
	
	hasThreshold: function() {
		var has = false;
		Array.each(this.fields, function (f) {
			if (f.name === 'threshold') {
				has = true;
			}
		}.bind(this));
		
		return has;
	},
	
	hasAlpha: function() {
		var has = false;
		Array.each(this.fields, function (f) {
			if (f.name === 'alpha') {
				has = true;
			}
		}.bind(this));
		
		return has;
	},
	
	getCSSID: function () {
		return 'im-' + this.getNormalizedName();
	},
	
	getCSSEditID: function () {
		return 'im-' + this.getNormalizedName() + '-edit';
	},
	
	getCSSRemoveID: function () {
		return 'im-' + this.getNormalizedName() + '-remove';
	},
	
	getCSSSliderID: function () {
		return 'im-' + this.getNormalizedName() + '-slider';
	},
	
	getCSSValueID: function () {
		return 'im-' + this.getNormalizedName() + '-value';
	}

});
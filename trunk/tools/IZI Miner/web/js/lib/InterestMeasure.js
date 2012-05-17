/*global Class: false */ 

var InterestMeasure = new Class({

	name: '',
	defaultValue: 0,
	localizedName: '',
	explanation: '',
	thresholdType: '',
	compareType: '',
	field: [],
	stringHelper: null,

	initialize: function (name, defaultValue, localizedName, explanation, thresholdType, compareType, fields, stringHelper) {
		this.name = name;
		this.defaultValue = defaultValue;
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
	
	getDefaultValue: function () {
		return this.defaultValue;
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
	
	getCSSID: function () {
		return 'im-' + this.getNormalizedName();
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
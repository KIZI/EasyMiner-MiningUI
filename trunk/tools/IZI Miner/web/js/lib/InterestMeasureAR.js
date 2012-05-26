/*global Class: false, InterestMeasure: false */ 

var InterestMeasureAR = new Class({
	Extends: InterestMeasure,

	threshold: null,
	alpha: null,
	displayPrecision: 6,
	
	initialize: function (name, localizedName, explanation, thresholdType, compareType, fields, stringHelper, threshold, alpha) {
		this.parent(name, localizedName, explanation, thresholdType, compareType, fields, stringHelper);
		this.threshold = threshold;
		this.alpha = alpha;
	},
	
	getValue: function () {
		return this.hasThreshold() ? this.getThreshold() : this.getAlpha();
	},
	
	setValue: function (val) {
		if (this.hasThreshold()) {
			this.threshold = val;
		} else {
			this.alpha = val;
		}
	},
	
	hasThreshold: function() {
		return this.threshold !== null;
	},
	
	getThreshold: function () {
		return this.threshold;
	},
	
	setThreshold: function (val) {
		this.threshold = val;
	},
	
	hasAlpha: function() {
		return this.alpha !== null;
	},
	
	getAlpha: function () {
		return this.alpha;
	},
	
	setAlpha: function (val) {
		this.alpha = val;
	},
	
	serialize: function () {
		var arr =  {
			name: this.name, 
			type: 'oper',
			thresholdType: this.thresholdType,
			compareType: this.compareType,
			fields: []};
		if (this.hasThreshold()) {
			var tr = {name: 'threshold', value: this.threshold};
			arr.fields.push(tr);
		}
		if (this.hasAlpha()) {
			var tr = {name: 'alpha', value: this.alpha};
			arr.fields.push(tr);
		}
		
		return arr;
	},
	
	toString: function () {
		return this.getLocalizedName() + ':<span class="im-value">' + this.getValue().format({decimals: this.displayPrecision}) + '</span>';
	}

});
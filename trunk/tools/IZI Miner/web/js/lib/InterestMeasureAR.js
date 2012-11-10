var InterestMeasureAR = new Class({
	Extends: InterestMeasure,

	threshold: null,
	alpha: null,
	displayPrecision: 6,
	
	initialize: function (name, localizedName, explanation, thresholdType, compareType, fields, stringHelper, def, threshold, alpha) {
		this.parent(name, localizedName, explanation, thresholdType, compareType, fields, stringHelper, def);
		this.threshold = threshold;
		this.alpha = alpha;
	},
	
	getThreshold: function () {
		return this.threshold;
	},
	
	setThreshold: function (val) {
		this.threshold = val;
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
		return this.getLocalizedName() + ':<span class="im-value">' + this.getThreshold().format({decimals: this.displayPrecision}) + '</span>';
	}

});
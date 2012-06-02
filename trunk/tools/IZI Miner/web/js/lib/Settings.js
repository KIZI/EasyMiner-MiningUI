var Settings = new Class({
	
	rulesCnt: 100,
	BK: {autoSearch: false},
	rec: {enabled: true},
	foundRules: {
		AJAXBalancerLimit: 10,
		displayLimit: 10
	},
	
	initialize: function () {},
	
	getRulesCnt: function () {
		return this.rulesCnt;
	},
	
	setRulesCnt: function (cnt) {
		this.rulesCnt = cnt;
	},
	
	getBKAutoSearch: function () {
		return this.BK.autoSearch;
	},
	
	setBKAutoSearch: function (val) {
		this.BK.autoSearch = val;
	},
	
	getRecEnabled: function () {
		return this.rec.enabled;
	},
	
	setRecEnabled: function (val) {
		this.rec.enabled = val;
	}

});
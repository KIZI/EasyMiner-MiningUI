var FoundRule = new Class({
	
	rule: null,
	interesting: null,
	
	initialize: function (rule) {
		this.rule = rule;
	},
	
	getRule: function () {
		return this.rule;
	},
	
	getInteresting: function () {
		return this.interesting;
	},
	
	setInteresting: function (val) {
		this.interesting = val;
	}
	
});
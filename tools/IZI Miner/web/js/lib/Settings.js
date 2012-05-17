var Settings = new Class({
	
	rulesCnt: 25,
	sorts: ['id', 'im', 'length'],
	defSort: 'id',
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
	
	getSorts: function () {
		return this.sorts;
	},
	
	getDefSort: function () {
		return this.defSort;
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
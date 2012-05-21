var FoundRule = new Class({
	
	rule: null,
	indexed: false,
	interesting: null,
	exception: null,
	
	initialize: function (rule) {
		this.rule = rule;
	},
	
	getRule: function () {
		return this.rule;
	},
	
	getIndexed: function () {
		return this.indexed;
	},
	
	setIndexed: function (val) {
		this.indexed = val;
	},
	
	isInteresting: function () {
		return (this.interesting !== null);
	},
	
	getInteresting: function () {
		return this.interesting;
	},
	
	setInteresting: function (val) {
		this.interesting = val;
	},
	
	isException: function () {
		return (this.exception !== null);
	},
	
	getException: function () {
		return this.exception;
	},
	
	setException: function (val) {
		this.exception = val;
	}
	
});
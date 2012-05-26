var FoundRule = new Class({
	
	Properties: ['exception', 'indexed', 'interesting', 'rule'],
	
	$exception: null,
	$indexed: false,
	$interesting: null,
	$rule: null,
	
	initialize: function (rule) {
		this.$rule = rule;
	},
	
	getCSSID: function() {
		return 'found-rule-' + this.getRule().getId();
	},
	
	isException: function () {
		return (this.$exception !== null);
	},
	
	isInteresting: function () {
		return (this.$interesting !== null);
	}
	
});
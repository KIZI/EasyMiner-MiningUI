/*global Class: false */ 

var RulePattern = new Class({

	name: '',
	minNumberOfBBAs: null,
	maxNumberOfBBAs: null,

	initialize: function (name, minNumberOfBBAs, maxNumberOfBBAs) {
		this.name = name;
		this.minNumberOfBBAs = minNumberOfBBAs;
		this.maxNumberOfBBAs = maxNumberOfBBAs;
	}

});
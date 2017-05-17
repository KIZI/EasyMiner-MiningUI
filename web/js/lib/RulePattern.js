/*global Class: false */
/**
 * Class RulePattern
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
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
/*global Class: false */
/**
 * Class Connective
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var Connective = new Class({

	id: 0,
	name: '',

	initialize: function (id, name) {
		this.id = id;
		this.name = name;
	},
	
	getName: function () {
		return this.name;
	},
	
	getCSSID: function () {
		return 'connective-' + this.id;
	},

    toLogical: function () {
        return (this.name === 'Conjunction' ? 'and' : 'or');
    },

	serialize: function () {
		return {
            id: this.id,
            name: this.toLogical().toUpperCase(),
			type: this.toLogical()
        };
	},
	
	toString: function() {
		return ('<div class="connective">' + this.toLogical() + '</div>');
	}

});
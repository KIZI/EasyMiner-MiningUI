/*global Class: false */ 

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
		return {name: this.toLogical().toUpperCase(),
			type: this.toLogical()};
	},
	
	toString: function() {
		return ('<span class="connective">' + this.toLogical() + '</span>');
	}

});
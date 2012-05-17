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
	
	set: function (name) {
		this.name = name;
	},
	
	serialize: function () {
		return {name: this.toString().toUpperCase(), 
			type: this.toString()};
	},
	
	toString: function() {
		return (this.name === 'Conjunction' ? 'and' : 'or');
	}

});
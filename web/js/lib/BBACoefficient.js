/**
 * Class BBACoefficient
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var BBACoefficient = new Class({

	name: '',
	localizedName: '',
	explanation: '',
	fields: {},

	initialize: function (name, localizedName, explanation) {
		this.name = name;
		this.localizedName = localizedName || '';
		this.explanation = explanation || '';
	},
	
	getName: function () {
		return this.name;
	},

    getLocalizedName: function () {
        if (this.localizedName.length !== 0) {
            return this.localizedName;
        }

        return this.name;
    },
	
	getExplanation: function () {
		return this.explanation;
	},
	
	getField: function (type) {
		if (this.fields[type] !== null && this.fields[type] !== undefined) {
			return this.fields[type];
		}
		
		return null;
	},
	
	getFields: function () {
		return this.fields;
	},
	
	addField: function (type, field) {
		this.fields[type] = field;
	}

});
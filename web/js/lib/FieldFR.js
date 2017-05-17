/**
 * Class FieldFR
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var FieldFR = new Class({
	Extends: Field,
	
	marked: false,

	initialize: function () {
        if (typeof arguments[0] !== 'number') { throw 'Error initializing FieldFR: ID is not a Number'; }
        if (typeof arguments[1] !== 'object') { throw 'Error initializing FieldFR: Ref is not an Object'; }
        if (typeof arguments[2] !== 'string') { throw 'Error initializing FieldFR: Type is not a String'; }
        if (typeof arguments[3] !== 'string') { throw 'Error initializing FieldFR: Localized name is not a String'; }
        if (typeof arguments[4] !== 'object') { throw 'Error initializing FieldFR: String helper name is not an Object'; }
        if (arguments.length === 6) {
            if (typeof arguments[5] !== 'string' && !Array.isArray(arguments[5])) { throw 'Error initializing FieldFR: Category is not a String'; }
        } else {
            if (typeof arguments[5] !== 'number') { throw 'Error initializing FieldFR: Minimal length is not a Number'; }
            if (typeof arguments[6] !== 'number') { throw 'Error initializing FieldFR: Maximal length is not a Number'; }
        }

		this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	},
	
	hasPositiveSign: function () {
		return this.sign;
	},

    toString: function () {
        var string = '<span class="field">';
        if (!this.hasPositiveSign()) {
            string += '<span class="field-sign negative"></span>';
        }

        if (this.category.join().contains('<') || this.category.join().contains('>')) {
            string += this.getAttributeName() + '<span class="coefficient">' + this.category.join(', ') + '</span>';
        } else {
            string += this.getAttributeName() + '<span class="coefficient">(' + this.category.join(', ') + ')</span>';
        }
        string += '</span>';

        return string;
    }
	
});
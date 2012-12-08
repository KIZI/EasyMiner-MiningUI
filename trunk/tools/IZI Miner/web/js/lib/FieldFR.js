var FieldFR = new Class({
	Extends: Field,
	
	marked: false,

	initialize: function () {
		this.parent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
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
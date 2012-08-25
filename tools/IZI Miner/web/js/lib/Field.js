var Field = new Class({

	id: 0,
	ref: null,
	type: null,
	minimalLength: null,
	maximalLength: null,
	category: null,
	stringHelper: null,
	
	initialize: function () {
		this.id = arguments[0];
		this.ref = arguments[1];
		this.type = arguments[2];
		this.stringHelper = arguments[3];
		if (arguments.length === 5) { // One category
			this.category = arguments[4];
		} else if (arguments.length === 6) { // Interval, Cut, ...
			this.minimalLength = arguments[4];
			this.maximalLength = arguments[5];
		}
	},
	
	getId: function () {
		return this.id;
	},
	
	getRef: function () {
		return this.ref;
	},
	
	getType: function () {
		return this.type;
	},
	
	getMinimalLength: function () {
		return this.minimalLength;
	},
	
	getMaximalLength: function () {
		return this.maximalLength;
	},
	
	getCategory: function () {
		return this.category;
	},
	
	getCSSID: function () {
		return 'field-nav-' + this.getNormalizedName();
	},
	
	getNormalizedName: function () {
		return this.stringHelper.normalizeString(this.getAttributeName());
	},
	
	getCSSDragID: function () {
		return 'field-nav-drag-' + this.id;
	},
	
	getAttributeName: function () {
		return this.ref.getName();
	},
	
	setCoefficient: function () {
		if (arguments.length === 2) { // One category
			this.type = arguments[0];
			this.minimalLength = null;
			this.maximalLength = null;
			this.category = arguments[1];
		} else {
			this.type = arguments[0];
			this.minimalLength = arguments[1];
			this.maximalLength = arguments[2];
			this.category = null;
		}
	},
	
	toString: function () {
		if (!this.type) {
			return this.getAttributeName();
		}

		if (this.type === 'One category') {
            if (this.category.contains('<') || this.category.contains('>')) {
                return this.getAttributeName() + '<span class="coefficient">' + this.category + '</span>';
            } else {
			    return this.getAttributeName() + '<span class="coefficient">(' + this.category + ')</span>';
            }
        } else if (this.type == 'Subset' && this.minimalLength == 1 && this.maximalLength == 1) {
            return this.getAttributeName() + '<span class="coefficient">(*)</span>';
        } else {
			return this.getAttributeName() + '<span class="coefficient">(*' + this.type + ' ' + this.minimalLength + '-' + this.maximalLength + ')</span>';
		}
	}

});
var InterestMeasureAddSlider = new Class({
	Extends: Slider,
	
	numSteps: 100,
	precision: 0,
	inversePrecision: 2,
	dataType: 'double',
	
	elementSlider: null,
	field: null,
	numberNormalizer: null,
	inverseNumberNormalizer: null,
	
	initialize: function (elementSlider, field) {
		this.dataType = field.dataType;
		this.elementSlider = elementSlider;
		this.field = field;
		
		if (this.dataType !== 'enum') {
			this.numberNormalizer = new NumberNormalizer(field.minValue, field.maxValue, this.inversePrecision, 0, this.numSteps, this.precision, this.numSteps, field.minValueInclusive, field.maxValueInclusive);
			this.inverseNumberNormalizer = new NumberNormalizer(0, this.numSteps, this.precision, field.minValue, field.maxValue, this.inversePrecision, this.numSteps, field.minValueInclusive, field.maxValueInclusive);
		}
		
		this.parent(this.elementSlider, this.elementSlider.getElement('.knob'), {
	        range: [0, (this.dataType !== 'enum' ? this.numSteps : (field.values.length - 1))],
	        initialStep: this.dataType !== 'enum' ? this.numberNormalizer.normalize(this.field.defaultValue) : this.field.values.indexOf(this.field.defaultValue),
	        
	        onChange: function(value) {
	        	this.handleChange(value);
	        }
	    });
	},
	
	handleChange: function (value) {
		if (this.dataType !== 'enum') {
	    	var number = this.inverseNumberNormalizer.validate(value);
	    	number = this.inverseNumberNormalizer.normalize(number);
	    	var string = this.inverseNumberNormalizer.format(number);
	
	    	$('add-im-' + this.field.name + '-value').value = string;
		} else {
			var number = this.field.values[value];
			$('add-im-' + this.field.name + '-value').value = number;
		}
	}

});
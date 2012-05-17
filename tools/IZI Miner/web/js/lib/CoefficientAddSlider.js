var CoefficientAddSlider = new Class({
	Extends: Slider,
	
	numSteps: 100,
	precision: 0,
	inversePrecision: 0,
	initialStep: 1,
	
	constraint: null,
	elementSlider: null,
	elementValue: null,
	previousSlider: null,
	numberNormalizer: null,
	inverseNumberNormalizer: null,
	
	initialize: function (elementSlider, elementValue, constraint, previousSlider) {
		this.numSteps = Math.abs(constraint.minValue - constraint.maxValue) + 1;
		this.constraint = constraint;
		this.elementSlider = elementSlider;
		this.elementValue = elementValue;
		this.previousSlider = previousSlider;
		this.numberNormalizer = new NumberNormalizer(constraint.minValue, constraint.maxValue, this.inversePrecision, constraint.minValue, constraint.maxValue, this.precision, this.numSteps, constraint.minValueInclusive, constraint.maxValueInclusive);
		this.inverseNumberNormalizer = new NumberNormalizer(constraint.minValue, constraint.maxValue, this.precision, constraint.minValue, constraint.maxValue, this.inversePrecision, this.numSteps, constraint.minValueInclusive, constraint.maxValueInclusive);
		
		this.parent(this.elementSlider, this.elementSlider.getElement('.knob'), {
	        range: [constraint.minValue, constraint.maxValue],
	        initialStep: this.numberNormalizer.normalize(this.initialStep),
	        onChange: function(value) {
	        	this.handleChange(value);
	        }
	    });
	},
	
	handleChange: function (value) {
    	var number = this.inverseNumberNormalizer.validate(value);
    	number = this.inverseNumberNormalizer.normalize(number);
    	var string = this.inverseNumberNormalizer.format(number);

    	this.elementValue.value = string;
    	
    	if (this.previousSlider !== undefined && (this.previousSlider.elementValue.value > number)) {
    		this.previousSlider.set(number);
    	}
	}

});
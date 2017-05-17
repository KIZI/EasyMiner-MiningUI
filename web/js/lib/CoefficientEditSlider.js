/**
 * Class CoefficientEditSlider
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 *
 * @type Class
 */
var CoefficientEditSlider = new Class({
	Extends: Slider,
	
	numSteps: 100,
	precision: 0,
	inversePrecision: 0,
	
	elementSlider: null,
	elementValue: null,
    previousSlider: null,
    nextSlider: null,
	numberNormalizer: null,
	inverseNumberNormalizer: null,
	
	initialize: function (elementSlider, elementValue, minValue, minValueInclusive, maxValue, maxValueInclusive) {
		this.numSteps = Math.abs(minValue - maxValue) + 1;
		this.elementSlider = elementSlider;
		this.elementValue = elementValue;
		this.numberNormalizer = new NumberNormalizer(minValue, maxValue, this.inversePrecision, minValue, maxValue, this.precision, this.numSteps, minValueInclusive, maxValueInclusive);
		this.inverseNumberNormalizer = new NumberNormalizer(minValue, maxValue, this.precision, minValue, maxValue, this.inversePrecision, this.numSteps, minValueInclusive, maxValueInclusive);
		
		this.parent(this.elementSlider, this.elementSlider.getElement('.knob'), {
	        range: [minValue, maxValue],
	        initialStep: elementValue.value,
	        onChange: function(value) {
	        	this.handleChange(value);
	        }
	    });
	},

    setPreviousSlider: function(previousSlider) {
        this.previousSlider = previousSlider;
    },

    setNextSlider: function(nextSlider) {
        this.nextSlider = nextSlider;
    },
	
	handleChange: function (value) {
    	var number = this.inverseNumberNormalizer.validate(value);
    	number = this.inverseNumberNormalizer.normalize(number);
    	var string = this.inverseNumberNormalizer.format(number);

    	this.elementValue.value = string;
    	
    	if (this.previousSlider && (this.previousSlider.elementValue.value > number)) {
    		this.previousSlider.set(number);
    	}

        if (this.nextSlider && (this.nextSlider.elementValue.value < number)) {
            this.nextSlider.set(number);
        }
	}
});
var InterestMeasureARSlider = new Class({
	Extends: Slider,
	
	numSteps: 100,
	precision: 0,
	inversePrecision: 2,
	dataType: 'double',
	
	elementSlider: null,
	IM: null,
	field: null,
	ARManager: null,
	numberNormalizer: null,
	inverseNumberNormalizer: null,
	
	initialize: function (elementSlider, IM, field, ARManager) {
		this.dataType = field.dataType;
		this.elementSlider = elementSlider;
		this.IM = IM;
		this.field = field;
		this.ARManager = ARManager;
		
		if (this.dataType !== 'enum') {
			this.numberNormalizer = new NumberNormalizer(this.field.minValue, this.field.maxValue, this.inversePrecision, 0, 100, this.precision, this.numSteps, this.field.minValueInclusive, this.field.maxValueInclusive);
			this.inverseNumberNormalizer = new NumberNormalizer(0, 100, this.precision, this.field.minValue, this.field.maxValue, this.inversePrecision, this.numSteps, this.field.minValueInclusive, this.field.maxValueInclusive);
		}
		
		this.parent(this.elementSlider, this.elementSlider.getElement('.knob'), {
			range: [0, (this.dataType !== 'enum' ? this.numSteps : (this.field.values.length - 1))],
	        initialStep: this.dataType !== 'enum' ? this.numberNormalizer.normalize(IM.getThreshold()) : this.field.values.indexOf(IM.getAlpha()),
	        
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
	    	
	    	//if (this.IM.hasAlpha()) {
	    	//	$(this.IM.getCSSValueID()).set('text', string + ', α ' + this.IM.getAlpha());
	    	//} else {
	    		$(this.IM.getCSSValueID()).set('text', string);
	    	//}
		} else {
			var number = this.field.values[value];
			//$(this.IM.getCSSValueID()).set('text', 'α=' + number);
			$(this.IM.getCSSValueID()).set('text', number);
		}
		
		//IM.setValue(number);
		//this.ARManager.setIMChanged();

    	this.elementSlider.fireEvent('change');
	}

});
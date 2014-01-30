var InterestMeasureSlider = new Class({
	Extends: Slider,

	elParent: null,
	field: null,
	action: '',
	IM: null,
	dataType: '',
	
	sliderEnabled: true,
	sliderWidth: 0,
	sliderBorder: 10,
	sliderDefaultWidth: 110,
	sliderMaxWidth: 200,
	elSlider: null,
	valueDefaultWidth: 6,
	elValue: null,
	inversePrecision: 0,
	numSteps: 0,
	precision: 0,
	
	numberNormalizer: null,
	inverseNumberNormalizer: null,
	
	initialize: function (elParent, field, action, IM, value) {
		this.elParent = elParent;
		this.field = field;
		this.action = action;
		this.IM = IM;
		this.dataType = this.field.dataType;

        var offset = 0;
        if (IM.getName() === 'SUPP') {
            this.field.minValue = value;
            this.field.minValueInclusive = true;
            if (this.field.minValue > 0) {
                offset = this.field.minValue * 100;
            }
        } else if (this.field.maxValue > value) {
            this.field.maxValue = value;
            this.field.maxValueInclusive = true;
        }
		
		// calculate num
		this.calculateNumSteps();


		// normalizers
		if (this.dataType !== 'enum') {
			this.numberNormalizer = new NumberNormalizer(this.field.minValue, this.field.maxValue, this.inversePrecision, 0 + offset, this.numSteps + offset, this.precision, this.numSteps, this.field.minValueInclusive, this.field.maxValueInclusive);
			this.inverseNumberNormalizer = new NumberNormalizer(0 + offset, this.numSteps + offset, this.precision, this.field.minValue, this.field.maxValue, this.inversePrecision, this.numSteps, this.field.minValueInclusive, this.field.maxValueInclusive);
		}

		// create HTML elements
		this.createInput();

		if (this.sliderEnabled) { // create slider
			this.createSlider();
			this.parent(this.elSlider, this.elSlider.getElement('.knob'), {
				range: [0 + offset, this.numSteps + offset],
				initialStep: this.getValue(),
				onChange: function (value) {
					this.handleChange(value);
				}
			});
		} else { // set defaultValue
			this.elValue.set('value', this.getValue());
		}
	},
	
	calculateNumSteps: function () {
		if (this.dataType === 'double') {
    console.log(this.field.maxValue);
    console.log(this.field.minValue);
    console.log(this.sliderMaxWidth)
			var numSteps = (this.field.maxValue - this.field.minValue) * 100;//TODO Standa
      /*if ((numSteps + this.sliderBorder) > this.sliderMaxWidth){
        numSteps=this.sliderMaxWidth-this.sliderBorder;
      }           */
			if ((numSteps + this.sliderBorder) <= this.sliderMaxWidth) {
				this.numSteps = numSteps;
				this.sliderWidth = this.sliderBorder + this.numSteps;
				this.inversePrecision = 3;//TODO Standa
			} else {
				this.sliderEnabled = false;
			}
		} else if (this.dataType === 'integer') {
			var numSteps = this.field.maxValue - this.field.minValue;
			if ((numSteps + this.sliderBorder) <= this.sliderMaxWidth) {
				this.numSteps = numSteps;
				this.sliderWidth = this.sliderBorder + this.numSteps;
			} else {
				this.sliderEnabled = false;
			}
		} else if (this.dataType === 'enum') {
			this.numSteps = (this.field.values.length - 1);
			this.sliderWidth = this.sliderDefaultWidth;
		} else {
			this.numSteps = 100;
			this.sliderWidth = this.sliderDefaultWidth;
		}
	},
	
	createInput: function () {
		var elLabel = new Element('label', {
			'for': 'add-im-' + this.field.name + '-value',
			html: this.field.localizedName + ':'
		});
		this.elParent.grab(elLabel);
		
		var width = this.dataType !== 'enum' ? this.field.maxValue.toString().length * 2 + (this.dataType !== 'integer' ? this.inversePrecision + 1 : 0) : this.valueDefaultWidth;
		this.elValue = new Element('input', {
			type: 'number',
			id: this.action + '-im-' + this.field.name + '-value',
			name: this.action + '-im-' + this.field.name + '-value', 
            pattern: '',
			'data-validators': 'dataType:"' + this.dataType + '" minValue:' + this.field.minValue + ' minValueInclcusive:' + this.field.minValueInclusive + ' maxValue:' + this.field.maxValue + ' maxValueInclusive:' + this.field.maxValueInclusive,
			'class': this.action + '-im-value',
			styles: {
				width: width + 'ex'
			}
		});

        if (this.sliderEnabled) {
            this.elValue.set('readonly', 'readonly');
        }

		this.elParent.grab(this.elValue);
		
		if (!this.sliderEnabled) {
			// input comment
			var comment = new Element('em', {
				html: this.dataType.capitalize() + ' ' + (this.field.minValueInclusive ? '<' : '(') + this.field.minValue + '; ' + this.field.maxValue.format({group: ' '}) + (this.field.maxValueInclusive ? '>' : ')')
			});
			this.elParent.grab(comment);
			
			// input validation message
			var label = new Element('label', {html: '&nbsp;'});
			this.elParent.grab(label);
			var error = new Element('div', {
				id: 'message'
			});
			this.elParent.grab(error);
		}
	},
	
	createSlider: function () {
		this.elSlider = new Element('div#', {
			id: this.action + '-im-' + this.field.name +'-slider', 
			'class': 'slider',
			styles: {
				width: this.sliderWidth
			}
		});
		var elKnob = new Element('div', {
			'class': 'knob'
		});
		this.elSlider.grab(elKnob);
		this.elParent.grab(this.elSlider);
	},
	
	getValue: function () {
		if (this.action === 'add') {
			if (this.sliderEnabled) {
				return this.dataType !== 'enum' ? this.numberNormalizer.normalize(Math.max(this.field.minValue, this.field.defaultValue)) : this.field.values.indexOf(this.field.defaultValue);
			} else {
				return Math.max(this.field.minValue, this.field.defaultValue);
			}
		} else { // edit
			if (this.sliderEnabled) {
				if (this.dataType !== 'enum') {
					return this.numberNormalizer.normalize(this.field.name === 'threshold' ? this.IM.getThreshold() : this.IM.getAlpha());
				} else {
					return this.field.values.indexOf(this.field.name === 'threshold' ? this.IM.getThreshold() : this.IM.getAlpha());
				}
			} else {
				return this.field.name === 'threshold' ? this.IM.getThreshold() : this.IM.getAlpha();
			}
		}
	},
	
	handleChange: function (value) {
		if (this.dataType !== 'enum') {
	    	var number = this.inverseNumberNormalizer.validate(value);
	    	number = this.inverseNumberNormalizer.normalize(number);
	    	var string = this.inverseNumberNormalizer.format(number);
	    	this.elValue.set('value', string);
		} else {
			var number = this.field.values[value];
			this.elValue.set('value', number);
		}
	}

});
var IMValidator = new Class({
	
	initialize: function () {},

	validate: function (IM, action, errorText) {
		var valid = true;
		if (IM.hasThreshold()) {
			var validator = new InputValidator('required', {
			    test: function (el, props) {
			    	var val = el.get('value').replace(',','.');
			    	if (props.dataType === 'integer') {
			    		val = !isNaN(val.toInt()) ? val.toInt() : '';
			    	} else if (props.dataType === 'float') {
			    		val = !isNaN(val.toFloat()) ? val.toFloat() : '';
			    	}
			    	el.set('value', val);
			    	
			    	var elMessage = $('message').set('style', 'float: left;');
			    	if (el.get('value') === null || 
			    		el.get('value').length === 0 ||
			    		props.minValueInclusive && val < props.minValue ||
			    		!props.minValueInclusive && val <= props.minValue ||
			    		props.maxValueInclusive && val > props.maxValue ||
			    		!props.maxValueInclusive && val >= props.maxValue) {
			    		
			    		elMessage.set('html', errorText);
			    		return false;
			    	}

                    elMessage.set('html', '');
			    	return true;
			    }
			});
			
			valid &= validator.test($(action + '-im-threshold-value'));
		}
		
		return valid;
	}
	
});
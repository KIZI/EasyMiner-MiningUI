var IMValidator = new Class({
	
	initialize: function () {},

	validate: function (IM, action) {
		var valid = true;
		if (IM.hasThreshold()) {
			var validator = new InputValidator('required', {
			    test: function (el, props) {
			    	var val = el.get('value');
			    	if (props.dataType === 'integer') {
			    		val = !isNaN(val.toInt()) ? val.toInt() : '';
			    	} else if (props.dataType === 'float') {
			    		val = !isNaN(val.toFloat()) ? val.toFloat() : '';
			    	}
			    	el.set('value', val);
			    	
			    	var elMessage = $('message');
			    	if (el.get('value') === null || 
			    		el.get('value').length === 0 ||
			    		props.minValueInclusive && val < props.minValue ||
			    		!props.minValueInclusive && val <= props.minValue ||
			    		props.maxValueInclusive && val > props.maxValue ||
			    		!props.maxValueInclusive && val >= props.maxValue) {
			    		
			    		elMessage.set('html', i18n.translate('Invalid value'));
			    		return false;
			    	}
			    	
			    	return true;
			    }
			});
			
			valid &= validator.test($(action + '-im-threshold-value'));
		}
		
		return valid;
	}
	
});
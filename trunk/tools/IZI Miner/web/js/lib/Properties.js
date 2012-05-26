Class.Mutators.Properties = function(properties) {
	var self = this;
	Array.from(properties).each(function(property) {
		var captProp = property.capitalize();
		var $prop = '$' + property;
		
		// settter
		self.implement('set' + captProp, function(value) {
			this[$prop] = value;
			return this;
		});
		
		// gettter
		self.implement('get' + captProp, function(value) {
			return this[$prop];
		});
	});
};
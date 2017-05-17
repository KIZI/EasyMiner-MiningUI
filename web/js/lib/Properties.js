/**
 * GetterSetter Class Properties
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 */
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
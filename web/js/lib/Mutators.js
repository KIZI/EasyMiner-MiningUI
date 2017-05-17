/**
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 * @link http://github.com/kizi/easyminer-miningui
 */
// GetterSetter Class mutator
Class.Mutators.GetterSetter = function(properties) {
    var klass = this;
    Array.from(properties).each(function(property) {
        var captProp = property.capitalize();
        var $prop = '$' + property;

        // setter method
        klass.implement('set' + captProp, function(value) {
            this[$prop] = value;
            return this;
        });

        // getter method
        klass.implement('get' + captProp, function(value) {
            return this[$prop];
        });
    });
};

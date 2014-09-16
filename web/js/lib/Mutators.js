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

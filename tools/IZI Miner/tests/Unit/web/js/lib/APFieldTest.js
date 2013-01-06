
module('APField');

test('getCSSID', function () {
	var field = new APField('payments', 'Long integer', new StringHelper());
	
	strictEqual(field.getCSSID(), 'field-nav-payments');
});

test('load', function() {
    var field = new APField();
    field.load({$name: 'orders', $stringHelper: {}, $value: 0});

    strictEqual(field.getName(), 'orders');
    strictEqual(instanceOf(field.getStringHelper(), StringHelper), true);
    strictEqual(field.getValue(), 0);
});
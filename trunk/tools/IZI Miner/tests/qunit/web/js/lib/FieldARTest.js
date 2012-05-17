
module('FieldAR');

test('getCSSRemoveID', function () {
	var field = new FieldAR(1, new Attribute(), null, new StringHelper(), 'Subset', 1, 2);
	
	strictEqual(field.getCSSRemoveID(), 'remove-field-1');
});
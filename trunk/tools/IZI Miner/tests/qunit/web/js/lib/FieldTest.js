
module('Field');

test('Instantiation - not coefficient', function () {
	var attribute = new Attribute();
	var field = new Field(1, attribute, null);
	
	deepEqual(field.getRef(), attribute);
	strictEqual(field.getType(), null);
	strictEqual(field.getCategory(), null);
});

test('Instantiation - One category', function () {
	var attribute = new Attribute();
	var field = new Field(1, attribute, 'One category', null, 'Praha');
	
	deepEqual(field.getRef(), attribute);
	strictEqual(field.getType(), 'One category');
	strictEqual(field.getCategory(), 'Praha');
});

test('Instantiation - Subset', function () {
	var attribute = new Attribute();
	var field = new Field(1, attribute, 'Subset', null, 1, 2);
	
	deepEqual(field.getRef(), attribute);
	strictEqual(field.getType(), 'Subset');
	strictEqual(field.getMinimalLength(), 1);
	strictEqual(field.getMaximalLength(), 2);
});

test('getCSSID', function () {
	var field = new Field(1, new Attribute('District'), null, new StringHelper(), 'Subset', 1, 2);
	
	strictEqual(field.getCSSID(), 'field-nav-district');
});
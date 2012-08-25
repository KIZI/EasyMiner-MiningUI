
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

test('toString - empty', function() {
   var field = new Field(1, new Attribute('District'));

    strictEqual(field.toString(), 'District');
});

test('toString - One category', function() {
    var field = new Field(1, new Attribute('District'), 'One category', null, 'Prague');

    strictEqual(field.toString().stripTags(), 'District(Prague)');
});

test('toString - One category 2', function() {
    var field = new Field(1, new Attribute('Age'), 'One category', null, '<21; 30)');

    strictEqual(field.toString(), 'Age<span class="coefficient"><21; 30)</span>');
});

test('toString - Subset *', function() {
    var field = new Field(1, new Attribute('District'), 'Subset', null, 1, 1);

    strictEqual(field.toString().stripTags(), 'District(*)');
});

test('toString - Subset 1-2', function() {
    var field = new Field(1, new Attribute('District'), 'Subset', null, 1, 2);

    strictEqual(field.toString().stripTags(), 'District(*Subset 1-2)');
});
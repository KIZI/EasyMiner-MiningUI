module('BBACoefficient', {});

test('getName', function () {
    var coefficient = new BBACoefficient('Subset');

    strictEqual(coefficient.getName(), 'Subset');
});

test('getLocalizedName', function () {
    var coefficient1 = new BBACoefficient('Subset', 'Any one value');
    var coefficient2 = new BBACoefficient('Subset', '');

    strictEqual(coefficient1.getLocalizedName(), 'Any one value');
    strictEqual(coefficient2.getLocalizedName(), 'Subset');
});

test('getField', function() {
	var coefficient = new BBACoefficient();

	equal(coefficient.getField('invalidKey'), null);
});

test('addField 1', function () {
	var coefficient = new BBACoefficient();
	var field = {category: {}};
	coefficient.addField('category', field);
	
	deepEqual(coefficient.getField('category'), field);
});

test('addField 2', function () {
	var coefficient = new BBACoefficient();
	var field1 = {category: {}};	
	coefficient.addField('minimalLength', field1);
	var field2 = {minimalLength: {}};;	
	coefficient.addField('maximalLength', field2);
	
	deepEqual(coefficient.getField('minimalLength'), field1);
	deepEqual(coefficient.getField('maximalLength'), field2);
});
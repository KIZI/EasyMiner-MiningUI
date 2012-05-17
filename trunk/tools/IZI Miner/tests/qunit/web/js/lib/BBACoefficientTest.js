
module('BBACoefficient');

test('Instantiation', function () {
	var coefficient = new BBACoefficient('District', 'District', 'District in which the subject lives.');
	
	equal(coefficient.getName(), 'District');
	equal(coefficient.getLocalizedName(), 'District');
	equal(coefficient.getExplanation(), 'District in which the subject lives.');
	deepEqual(coefficient.getFields(), {});
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
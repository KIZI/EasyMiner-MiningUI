
module('Cedent');

test('isEmpty', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.isEmpty(), true)
});

test('isEmpty', function () {
	var cedent = new Cedent(1, 1, null, null, [new FieldAR()], []);
	
	strictEqual(cedent.isEmpty(), false)
});

test('isEmpty', function () {
	var cedent = new Cedent(1, 1, null, null, [], [new Cedent()]);
	
	strictEqual(cedent.isEmpty(), false)
});

test('getCSSID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSID(), 'cedent-1');
});

test('getCSSEditConnectiveID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSEditConnectiveID(), 'edit-connective-1');
});

test('getCSSAddCedentID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSAddCedentID(), 'add-cedent-1');
});

test('getCSSRemoveID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSRemoveID(), 'remove-cedent-1');
});

test('getCSSFieldsID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSFieldsID(), 'cedent-fields-1');
});

test('getCSSChangeSignID', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getCSSChangeSignID(), 'change-cedent-sign-1');
});

test('getNextLevel', function () {
	var cedent = new Cedent(1, 1, null, null, [], []);
	
	strictEqual(cedent.getNextLevel(), 2);
});
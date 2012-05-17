module('NumberNormalizer');

test('normalize - float 2 int', function () {
	var numberNormalizer = new NumberNormalizer(0, 1, 2, 0, 100, 0, 100, true, true);
	
	strictEqual(numberNormalizer.normalize(0), 0);
	strictEqual(numberNormalizer.normalize(0.33), 33);
	strictEqual(numberNormalizer.normalize(0.50), 50);
	strictEqual(numberNormalizer.normalize(1), 100);
});

test('normalize - int 2 float', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.normalize(0), 0);
	strictEqual(numberNormalizer.normalize(33), 0.33);
	strictEqual(numberNormalizer.normalize(50), 0.50);
	strictEqual(numberNormalizer.normalize(100), 1);
});

test('validate - int', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate(33), 33);
});

test('validate - too low int', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate(-200), 0);
});

test('validate - too high int', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate(200), 100);
});

test('validate - float', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate(0.333), 0.33);
});

test('validate - string', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate('0.333'), 0.33);
});

test('validate - object', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
	
	strictEqual(numberNormalizer.validate({number: 0.333}), 0);
});

test('format', function () {
	var numberNormalizer = new NumberNormalizer(0, 100, 0, 0, 1, 2, 100, true, true);
		
	strictEqual(numberNormalizer.format(0.4), '0.40');
});


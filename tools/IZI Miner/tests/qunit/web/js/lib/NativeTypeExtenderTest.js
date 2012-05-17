
module('NativeTypeExtender');

test('extendNativeElement - hasChildren', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeElement();

	strictEqual(Element.prototype.hasOwnProperty('hasChildren'), true);
	
	var element = $$('body')[0];
	strictEqual(element.hasChildren(), true);
});

test('extendNativeString - setCharAt', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeString();

	strictEqual(String.prototype.hasOwnProperty('setCharAt'), true);
	
	var string = 'abc';
	strictEqual(string.setCharAt('d', 1), 'adc');
});

test('extendNativeString - strtTr', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeString();

	strictEqual(String.prototype.hasOwnProperty('strTr'), true);
	
	var string = 'ášč';
	strictEqual(string.strTr(['á', 'š', 'č'], ['a', 's', 'c']), 'asc');
});

test('extendNativeArray - remove 1', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeArray();
	
	strictEqual(Array.prototype.hasOwnProperty('remove'), true);
	
	var array = ['value'];
	array = array.remove(0);
	strictEqual(array.length, 0);
});

test('extendNativeArray - remove 2', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeArray();
	
	var array = ['value0', 'value1'];
	array = array.remove(0);
	strictEqual(array[0], 'value1');
});

test('extendNativeArray - indexOfObject 1', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeArray();
	
	var array = [new Attribute('District')];
	strictEqual(array.indexOfObject('Quality', Attribute.prototype.getName), undefined);
});

test('extendNativeArray - indexOfObject 2', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeArray();
	
	var array = [new Attribute('District'), new Attribute('Quality')];
	strictEqual(array.indexOfObject('Quality', Attribute.prototype.getName), 1);
});

test('extendNativeArray - equal', function () {
	var nativeTypeExtender = new NativeTypeExtender();
	nativeTypeExtender.extendNativeArray();
	
	strictEqual([].equalsTo([]), true);
	strictEqual([1].equalsTo([1]), true);
	strictEqual([1].equalsTo([2]), false);
	strictEqual([1, 2, 3].equalsTo([3, 2, 1]), true);
	strictEqual([1, 2, 3, 4].equalsTo([1, 2, 3]), false);
});


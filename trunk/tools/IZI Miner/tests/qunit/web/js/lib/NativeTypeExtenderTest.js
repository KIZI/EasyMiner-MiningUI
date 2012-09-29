
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

test('extendNativeArray - insertAt', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5];
    arr = arr.insertAt(0, 0);
    arr = arr.insertAt(2, 2);
    arr = arr.insertAt(4, 4);
    arr = arr.insertAt(6, 6);

    for (var i = 0; i <= 6; i++) {
        strictEqual(arr[i], i);
    }
});

test('Array.removeAt - remove at the start', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt(0);

    strictEqual(arr.length, 3);
    strictEqual(arr[0], 3);
    strictEqual(arr[1], 5);
    strictEqual(arr[2], 7);
});

test('Array.removeAt - remove in the middle', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt(1);

    strictEqual(arr.length, 3);
    strictEqual(arr[0], 1);
    strictEqual(arr[1], 5);
    strictEqual(arr[2], 7);
});

test('Array.removeAt - remove at the end', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt(3);

    strictEqual(arr.length, 3);
    strictEqual(arr[0], 1);
    strictEqual(arr[1], 3);
    strictEqual(arr[2], 5);
});

test('Array.removeAt - remove two the start', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt([0, 1]);

    strictEqual(arr.length, 2);
    strictEqual(arr[0], 5);
    strictEqual(arr[1], 7);
});

test('Array.removeAt - remove two in the middle', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt([1, 2]);

    strictEqual(arr.length, 2);
    strictEqual(arr[0], 1);
    strictEqual(arr[1], 7);
});

test('Array.removeAt - remove two at the end', function() {
    var nativeTypeExtender = new NativeTypeExtender();
    nativeTypeExtender.extendNativeArray();

    var arr = [1, 3, 5, 7];
    arr = arr.removeAt([2, 3]);

    strictEqual(arr.length, 2);
    strictEqual(arr[0], 1);
    strictEqual(arr[1], 3);
});